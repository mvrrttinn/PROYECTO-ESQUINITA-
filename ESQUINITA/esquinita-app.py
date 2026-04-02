from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
import datetime

app = Flask(__name__)
# CORS permite que tu HTML (Frontend) se comunique con Python (Backend)
CORS(app)

# --- CONFIGURACIÓN DE TU BASE DE DATOS ---
DB_CONFIG = {
    "host": "localhost:3306",
    "user": "root",
    "password": "Martin0416*", # <--- CAMBIA ESTO
    "database": "esquinita"
}

def get_db_connection():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        if conn.is_connected():
            return conn
    except Error as e:
        print(f"[{datetime.datetime.now()}] ❌ Error de conexión: {e}")
        return None

# --- RUTAS DE LA API ---

# 1. Obtener Menú (GET)
@app.route('/api/productos', methods=['GET'])
def get_productos():
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "DB Offline"}), 500
    
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM productos")
    productos = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(productos)

# 2. Registrar Pedido en SQL (POST)
@app.route('/api/pedido', methods=['POST'])
def save_pedido():
    data = request.json
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "No se pudo conectar a la base de datos"}), 500
    
    cursor = conn.cursor()
    try:
        # Iniciar transacción para asegurar que no se pierdan datos
        # Insertamos la cabecera del pedido
        query_pedido = "INSERT INTO pedidos (total, metodo_pago, estado) VALUES (%s, %s, 'Pendiente')"
        cursor.execute(query_pedido, (data['total'], data['metodo_pago']))
        
        id_pedido = cursor.lastrowid
        
        # Insertamos el detalle de cada producto
        query_detalle = "INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, notas_especiales) VALUES (%s, %s, %s, %s)"
        for prod in data['productos']:
            cursor.execute(query_detalle, (id_pedido, prod['id'], prod['cantidad'], prod['notas']))
            
        conn.commit()
        print(f"[{datetime.datetime.now()}] ✅ Pedido #{id_pedido} registrado exitosamente.")
        return jsonify({"status": "success", "id": id_pedido}), 201

    except Error as e:
        conn.rollback() # Si algo falla, deshacemos los cambios
        print(f"[{datetime.datetime.now()}] ❌ Error al registrar: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# --- INICIO DEL SERVIDOR ---
if __name__ == '__main__':
    print("--------------------------------------------------")
    print("🍔 SISTEMA POS - LA ESQUINITA RUNNING 🍟")
    print(f"Hora de inicio: {datetime.datetime.now()}")
    print("--------------------------------------------------")
    
    # host='0.0.0.0' permite que otros dispositivos en tu Wi-Fi entren a la página
    # port=5000 es el puerto por defecto
    app.run(debug=True, host='0.0.0.0', port=5000)