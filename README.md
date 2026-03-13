# SIZE COMPARATOR – SPORTS BRANDS

Una herramienta interactivas para vendedores que permite comparar rápidamente talles de calzado y ropa entre diferentes marcas deportivas.

## Características

- 🎯 **Comparación Directa**: Permite ingresar un talle conocido de una marca y ver automáticamente la equivalencia en otras marcas.
- 📏 **Buscador de Talle por Medida**: Encuentra el talle recomendado ingresando directamente la longitud en centímetros.
- 🕴️ **Visualizador de Medidas**: Representaciones visuales (siluetas SVG) para mejorar la comprensión de las medidas en ropa y calzado.
- ⚡ **100% Frontend**: Aplicación sin backend, lista para ser desplegada como sitio estático en GitHub Pages o cualquier otro servidor web.

## Marcas Soportadas Actualmente

- Nike
- Adidas
- Vans
- Reebok
- 361 Degrees

## Cómo Desplegar (GitHub Pages / Local)

Dado que la aplicación es puramente HTML, CSS y JS básico:

1. **Despliegue en GitHub Pages:**
   - Sube este repositorio a GitHub.
   - Ve a `Settings` > `Pages`.
   - Selecciona la rama `main` (o `master`) y el directorio `/root`.
   - ¡Listo! Tu sitio estará en vivo poco después.

2. **Ejecución Local:**
   - Abre la terminal en el directorio del proyecto y ejecuta un servidor local como:
     ```bash
     npx serve .
     ```
     O bien con Python:
     ```bash
     python -m http.server
     ```
   - Abre `http://localhost:3000` (o el puerto que asigne).
   - *Nota: Abrir directamente `index.html` en el navegador vía "file://" causará problemas de CORS por los fetch() de los archivos JSON.*

## Cómo Agregar Nuevas Marcas o Talles

Toda la información reside en los archivos dentro de la carpeta `/data`:

- `shoes.json`
- `clothing.json`

### Ejemplo para agregar una nueva marca:

1.Abre `data/shoes.json`.
2.Agrega una nueva clave para la marca al nivel principal de la estructura JSON:

```json
{
  "nike": { ... },
  "adidas": { ... },
  "puma": {
    "men": {
      "warning": "Puma tiene talles estándar.",
      "sizes": [
        {"us": 7, "uk": 6, "eu": 39, "br": 38, "py": 39, "cm": 25},
        // ... más talles
      ]
    },
    "women": { ... }
  }
}
```

La aplicación detectará automáticamente la nueva marca y la agregará a los selectores desplegables al recargar.

## Estructura de Directorios

```
/size-comparator
  /data
    shoes.json
    clothing.json
  /assets
    shoe-outline.svg
    body-outline.svg
  index.html
  styles.css
  script.js
  README.md
```
