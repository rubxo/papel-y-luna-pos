function doGet(e) {
  return handleRequest(e, "GET");
}

function doPost(e) {
  return handleRequest(e, "POST");
}

function handleRequest(e, method) {
  // Configuración de permisos CORS básicos (Google lo maneja internamente)
  const resource = e.parameter.resource;
  if (!resource) return jsonResponse({ success: false, message: "Falta especificar la hoja (resource)" });

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(resource);
  if (!sheet) return jsonResponse({ success: false, message: "Hoja de cálculo no encontrada: " + resource });

  if (method === "GET") {
    const action = e.parameter.action;
    if (action === "delete") {
      const idToDelete = e.parameter.id;
      deleteRowById(sheet, idToDelete);
      return jsonResponse({ success: true, message: "Borrado por GET" });
    }
    // ---> LEER DATOS (Y AUTO-ARREGLAR IDs VACÍOS)
    return jsonResponse({ success: true, data: getSheetData(sheet) });

  } else if (method === "POST") {
    // ---> ESCRIBIR / ACTUALIZAR / ELIMINAR DATOS
    try {
      const payload = JSON.parse(e.postData.contents);
      const action = e.parameter.action; // Para saber si queremos 'delete'

      if (action === "delete") {
        deleteRowById(sheet, payload.id);
        return jsonResponse({ success: true, message: "Borrado exitosamente" });
      } else {
        upsertRow(sheet, payload);
        return jsonResponse({ success: true, message: "Guardado/Actualizado exitosamente" });
      }
    } catch (err) {
      return jsonResponse({ success: false, message: "Error leyendo los datos: " + err.message });
    }
  }
}

// --------------------------------------------------------
// LÓGICA PRINCIPAL (UPSERT: Actualiza si existe, Crea si no)
// --------------------------------------------------------
function upsertRow(sheet, payload) {
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  const headers = values[0].map(h => h.toString().trim()); // Limpia espacios ("id " -> "id")

  const idIndex = headers.indexOf("id");
  let rowIndex = -1;

  // Si enviamos un ID, buscamos a ver si ya existe para ACTUALIZARLO
  if (payload.id && idIndex > -1) {
    for (let i = 1; i < values.length; i++) {
      if (values[i][idIndex] == payload.id) {
        rowIndex = i + 1; // +1 porque la fila 1 son los encabezados
        break;
      }
    }
  }

  // Si no se envió un ID, generamos uno automáticamente
  if (!payload.id) {
    payload.id = "ID-" + new Date().getTime();
  }

  // Preparamos los datos ordenados exactamente como están las columnas
  const newRow = [];
  headers.forEach(h => {
    newRow.push(payload[h] !== undefined ? payload[h] : "");
  });

  if (rowIndex > -1) {
    // MODO ACTUALIZACIÓN: Sobrescribe exactamente esa fila (¡NO CREA DUPLICADOS!)
    sheet.getRange(rowIndex, 1, 1, newRow.length).setValues([newRow]);
  } else {
    // MODO CREACIÓN: Añade al final
    sheet.appendRow(newRow);
  }
}

function deleteRowById(sheet, id) {
  if (!id) return;
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(h => h.toString().trim());
  const idIndex = headers.indexOf("id");

  if (idIndex > -1) {
    let deleted = false;
    // Recorremos de abajo hacia arriba para evitar problemas con los índices al borrar filas
    for (let i = values.length - 1; i > 0; i--) {
      if (values[i][idIndex] == id) {
        sheet.deleteRow(i + 1);
        deleted = true;
        // No ponemos break aquí para que borre TODOS los duplicados fantasmas del pasado
      }
    }
  }
}

function getSheetData(sheet) {
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  const headers = values[0].map(h => h.toString().trim()); // Limpia espacios extra accidental
  const data = [];

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const item = {};
    let isRowEmpty = true;

    for (let j = 0; j < headers.length; j++) {
      item[headers[j]] = row[j];
      if (row[j] !== "") isRowEmpty = false;
    }

    if (!isRowEmpty) {
      // MAGIA: Si agregas un texto directo en el excel y olvidaste ponerle un ID, este bloque le crea uno solo y lo guarda
      if (!item.id && headers.indexOf("id") > -1) {
        const newId = "GEN-" + new Date().getTime() + "-" + i;
        sheet.getRange(i + 1, headers.indexOf("id") + 1).setValue(newId);
        item.id = newId;
      }
      data.push(item);
    }
  }
  return data;
}

function jsonResponse(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
