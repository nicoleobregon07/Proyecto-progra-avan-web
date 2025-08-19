# Proyecto Avanzada Web - Juego Connect4

## 👥 Integrantes del Grupo

**Nombre:** Elsbe Nicole Obregón Munguía  
**Carné:** FI22024693  
**Usuario GitHub:** [nicoleobregon07](https://github.com/nicoleobregon07)  
**Correo Git:** nicoleobregon07@gmail.com

**Nombre:** Kevin Alberto Calvo Brenes  
**Carné:** FI23028470  
**Usuario GitHub:** [KevinC-B](https://github.com/KevinC-B)  
**Correo Git:** kev170103@gmail.com

---

## 🧰 Frameworks y Herramientas Utilizadas

### Backend:
- Flask (Python)
- oracledb (conector a Oracle Database)

### Frontend:
- HTML5, CSS3, Bootstrap 5
- JavaScript (AJAX)

### Base de Datos:
- Oracle SQL (SQL Developer)

### Otras herramientas:
- GitHub
- Visual Studio Code

---

## 🌐 Tipo de Aplicación
**MPA** (Multi Page Application)

---

## 🏛️ Arquitectura

La aplicación usa `app.py` como controlador principal, plantillas HTML como vistas, y Oracle como modelo (base de datos). Todo está organizado por rutas Flask que conectan las vistas con la lógica de negocio.

---

## 🗂️ Diagrama de la Base de Datos (Mermaid)

![alt text](IMG/diagrama.png)
---

## ⚙️ Instrucciones de Instalación, Configuración y Ejecución

### 1. 🧱 Crear usuario y base de datos en Oracle

Desde la terminal con SQL*Plus o CMD:

```sql
sqlplus sys as sysdba

CREATE USER PROYECTOPROGRA1 IDENTIFIED BY PROYECTOPROGRA1;
GRANT CREATE SESSION TO PROYECTOPROGRA1;
GRANT ALL PRIVILEGES TO PROYECTOPROGRA1;
```

---

### 1.2 📄 Crear conexión en SQL Developer

Abre SQL Developer y seguí estos pasos para crear una nueva conexión:

- **Nombre de conexión:** cualquier nombre (por ejemplo: ConexionProgra)
- **Usuario:** PROYECTOPROGRA1
- **Contraseña:** PROYECTOPROGRA1
- **SID:** orcl

✅ Luego hacé clic en **Guardar y Conectar**.

> ℹ️ Tenés que haber creado el usuario en SQL*Plus antes de hacer la conexión.

---

### 2. 🧱 Crear las tablas necesarias

Ejecutá el siguiente script SQL en Oracle:

```sql
CREATE TABLE Jugadores (
    JugadorId NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Identificacion NUMBER UNIQUE NOT NULL,
    Nombre VARCHAR2(100) NOT NULL,
    Marcador NUMBER DEFAULT 0
);
-------------------------------------------------------------
CREATE TABLE Partidas (
    PartidaId NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    Jugador1Id NUMBER NOT NULL,
    Jugador2Id NUMBER NOT NULL,
    FechaInicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Estado VARCHAR2(20) DEFAULT 'EN_CURSO',
    GanadorId NUMBER,
    FOREIGN KEY (Jugador1Id) REFERENCES Jugadores(JugadorId),
    FOREIGN KEY (Jugador2Id) REFERENCES Jugadores(JugadorId),
    FOREIGN KEY (GanadorId) REFERENCES Jugadores(JugadorId)
);
ALTER TABLE Partidas ADD NumeroVisible NUMBER;
----------------------------------------------------------------
CREATE TABLE Movimientos (
    MovimientoId NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    PartidaId NUMBER NOT NULL,
    JugadorId NUMBER NOT NULL,
    Columna VARCHAR2(1) NOT NULL,
    Fila NUMBER NOT NULL,
    Turno NUMBER NOT NULL,
    FechaHora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (PartidaId) REFERENCES Partidas(PartidaId),
    FOREIGN KEY (JugadorId) REFERENCES Jugadores(JugadorId)
);
```

---

### 3. 🐍 Instalar Python y paquetes necesarios

Desde la terminal, ejecutá:

```bash
pip install flask oracledb
```

---

### 4. 📂 Clonar el repositorio

```bash
git clone https://github.com/nicoleobregon07/Proyecto-progra-avan-web.git
```

---

### 5. ⚙️ Configurar conexión a Oracle

Editá el archivo `app.py` y asegurate de que la función `get_db_connection()` esté así:

```python
def get_db_connection():
    return oracledb.connect(
        user="PROYECTOPROGRA1",
        password="PROYECTOPROGRA1",
        dsn="localhost:1521/orcl"
    )
```

📌 **Parámetros clave:**
- `user`: nombre del usuario Oracle.
- `password`: contraseña correspondiente.
- `dsn`: dirección del servicio Oracle, normalmente `localhost:1521/orcl`.

> ⚠️ Si usás otro SID, IP o puerto, modificá el `dsn` según tu entorno.

![alt text](IMG/conexion.jpg)
---

### 6. 🚀 Ejecutar la aplicación

1. Abrí una terminal en la carpeta del proyecto.
2. Ejecutá el archivo principal con:

```bash
python app.py
```
Ejemplo:![alt text](IMG/image-1.png) 

3. Luego abrí tu navegador y visitá:

```
http://localhost:5###/
```
Depende cual le abre: ![alt text](IMG/image-2.png)
---

## 7. 📚 Referencias y Prompts AI utilizados

Durante el desarrollo del sistema web interactivo Connect4, se utilizaron recursos de inteligencia artificial proporcionados por ChatGPT  para acelerar y mejorar tareas de programación, estilo visual y experiencia de usuario. El proceso fue iterativo y permitió afinar tanto la lógica como la presentación del sistema a través de múltiples interacciones.

Herramientas y Lenguajes Asistidos

HTML5 y CSS3: para estructuras semánticas modernas y estilos responsivos.

Bootstrap 5.3: integración de componentes visuales como cards, botones y formularios estilizados.

Python (Flask): asistencia en rutas, renderizado de templates (render_template) y manejo de formularios.

Jinja2: ayuda en condicionales, ciclos for, y control de errores en los templates.

Ejemplos de Prompts Utilizados

A continuación se presentan ejemplos de prompts utilizados y el resultado o fragmento de código generado:

🎨 Estilo Visual Centrado y Responsive

Prompt:

“¿Cómo centro vertical y horizontalmente un contenedor dentro del body usando Bootstrap y CSS personalizado?”

Resultado generado:

.content-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 100px 20px 60px;
}

📋 Mejora de Formulario de Creación de Partida

Prompt:

“Haz más grande el texto y los elementos del formulario para que se vean destacados.”

Código generado:

<h2 class="text-center display-5 fw-bold">🕹️ Crear nueva partida</h2>

label, select, .btn {
  font-size: 1.1rem;
  padding: 10px;
}

🎮 Lógica de Reinicio de Partida

Prompt:

“Quiero un botón que reinicie la misma partida y elimine los movimientos, pero que no cambie de jugadores.”

Código de la ruta Flask sugerida:

@app.route('/reiniciar/<int:partida_id>')
def reiniciar_partida(partida_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM Movimientos WHERE PartidaId = :1", (partida_id,))
    cursor.execute("""
        UPDATE Partidas
        SET Estado = 'EN_CURSO',
            GanadorId = NULL,
            FechaInicio = SYSDATE
        WHERE PartidaId = :1
    """, (partida_id,))

    conn.commit()
    conn.close()
    return redirect(url_for('jugar', partida_id=partida_id))

🧠 Lógica para Mostrar Turno Actual

Prompt:

“Quiero que se muestre el nombre del jugador en turno actual justo debajo del número de partida, con estilo llamativo.”

HTML generado:

<p class="lead mt-3">Turno actual: 
  <strong class="text-info" id="turno-actual">{{ jugador_turno }}</strong>
</p>

Conclusión

El uso de ChatGPT permitió no solo optimizar el tiempo de desarrollo, sino también mejorar la calidad del código, la organización visual y la experiencia interactiva. La IA funcionó como asistente técnico y creativo, ayudando a resolver problemas específicos de estilo, estructura y lógica de negocio con ejemplos prácticos, sugerencias claras y buenas prácticas.