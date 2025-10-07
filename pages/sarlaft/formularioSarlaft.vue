<template>
  <div>
    <template>
      <div class="text-center">
        <v-dialog v-model="preload" persistent width="300">
          <v-card color="primary" dark>
            <v-card-text>
              Tranquilo procesamos tu solicitud !
              <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
    </template>
    <v-card>

      <v-container>
        <v-row>
          <v-col cols="12" sm="12" md="12">
            <v-alert border="left" text outlined dense icon="mdi-person" color="info">
              <h4>Buscar identificación</h4>
            </v-alert>
          </v-col>
          <v-col cols="12" sm="12" md="10">
            <v-text-field v-model="form.cedula" label="Número de identifión" required>
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="2" class="pa-9">
            <v-btn color="success" small dark @click="buscarUsuario()">Buscar</v-btn>
          </v-col>
          <v-col cols="12" sm="12" md="12" v-if="usuario_id">
            <v-alert border="left" text outlined dense icon="mdi-person" color="info">
              <h4>FORMULARIO DE CONOCIMIENTO DEL
                CLIENTE / PROVEEDOR</h4>
            </v-alert>
          </v-col>
          <v-col cols="12" sm="12" md="6" v-if="usuario_id">
            <v-select :items="clase" v-model="informacion.tipo_cliente" label="¿Tipo cliente o proveedor?" required>
            </v-select>
          </v-col>
          <v-col cols="12" sm="12" md="6" v-if="usuario_id">
            <v-select :items="tipo_solicitud" v-model="informacion.tipo_solicitud" label="Tipo de solicitud" required>
            </v-select>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <v-text-field v-model="informacion.nombre_diligencia" label="Nombre De Quien Diligencia" required>
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <v-text-field v-model="informacion.cedula_diligencia" label="Numero de Identificacion" required>
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <v-text-field v-if="informacion.tipo_cliente !='Cliente Usuario Particular'"
              v-model="informacion.cargo_diligencia" label="Cargo" required>
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="12" md="12" v-if="usuario_id">
            <v-alert border="left" text outlined dense icon="mdi-person" color="info">
              <h4>INFORMACION GENERAL</h4>
            </v-alert>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <v-text-field v-model="tipo_documento" readonly label="Tipo De Documento">
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <v-text-field v-model="numero_documento" label="Numero De Documento">
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <v-text-field v-model="nombre" label="Nombre/Razón Social:">
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <v-select :items="Clase_Prov" v-model="informacion.clase" v-show="informacion.tipo_cliente == 'Proveedor'"
              label="Clase De Proveedor">
            </v-select>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id" v-show="informacion.tipo_cliente == 'Proveedor'">
            <v-select :items="Sector_Prov" v-model="informacion.sector" label="Sector">
            </v-select>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id" v-show="informacion.tipo_cliente == 'Proveedor'">
            <v-text-field v-model="informacion.cual_descripcion" label="¿Cual?">
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id" v-show="informacion.tipo_cliente != 'Proveedor'">
            <v-select :items="Clase_Cli" v-model="informacion.clase" label="Clase De Cliente">
            </v-select>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id" v-show="informacion.tipo_cliente != 'Proveedor'">
            <v-select :items="Sector_Cli" v-model="informacion.sector" label="Sector">
            </v-select>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id" v-show="informacion.tipo_cliente == 'Cliente'">
            <v-text-field v-model="informacion.cual_descripcion" label="¿Cual?">
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="6" v-if="usuario_id">
            <v-text-field v-model="informacion.tipo_bienservicio" label="Tipo bien/servicio a adquirir o proveer: "
              required></v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="6" v-if="usuario_id"
            v-show="informacion.tipo_cliente != 'Cliente Usuario Particular'">
            <v-text-field v-model="informacion.direccion" label="Dirección Principal:">
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id"
            v-show="informacion.tipo_cliente != 'Cliente Usuario Particular'">
            <v-autocomplete v-model="informacion.municipio_id" append-icon="mdi-magnify" :items="municipios"
              label="Buscar Municipio" item-text="nombre" item-value="id">
            </v-autocomplete>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id"
            v-show="informacion.tipo_cliente != 'Cliente Usuario Particular'">
            <v-autocomplete v-model="informacion.departamento_id" append-icon="mdi-magnify" :items="departamento"
              label="Buscar Deparamentos" item-text="nombre" item-value="id"></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <v-text-field v-model="informacion.email_empresa" label="Correo Electronico" required></v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <v-text-field v-model="informacion.telefono_empresa" label="Telefono" required>
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <v-text-field v-model="informacion.numero_contacto" label="Numero De Contacto" required>
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id"
            v-show="informacion.tipo_cliente != 'Cliente Usuario Particular'">
            <v-text-field v-model="informacion.fax" label="Fax"></v-text-field>
          </v-col>
        </v-row>
        <v-card-actions v-if="usuario_id">
          <v-spacer></v-spacer>
          <v-btn small color="success" @click="guardarInformacion()">Guardar</v-btn>
        </v-card-actions>
        <v-row>
          <v-col cols="12" sm="12" md="12" v-if="usuario_id && informacion.tipo_cliente !='Cliente Usuario Particular'">
            <v-alert border="left" text outlined dense icon="mdi-person" color="info">
              <h4>REPRESENTANTE LEGAL</h4>
            </v-alert>
          </v-col>
          <v-col cols="12" sm="12" md="12" v-if="usuario_id && informacion.tipo_cliente =='Cliente Usuario Particular'">
            <v-alert border="left" text outlined dense icon="mdi-person" color="info">
              <h4>REPRESENTANTE LEGAL</h4>
            </v-alert>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id && informacion.tipo_cliente !='Cliente Usuario Particular'">
            <v-text-field v-model="representante.nombre" label="Nombre Completo:">
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id && informacion.tipo_cliente !='Cliente Usuario Particular'">
            <v-select :items="Tipo_Doc" v-model="representante.tipo_doc" label="Tipo Documento:">
            </v-select>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id && informacion.tipo_cliente !='Cliente Usuario Particular'">
            <v-text-field v-model="representante.num_doc" label="Numero:">
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <v-text-field label="Fecha De Expedición" type="date" color="primary" v-model="representante.fecha_exp"
              required>
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id && informacion.tipo_cliente !='Cliente Usuario Particular'">
            <v-autocomplete v-model="representante.lugar_expedicion_id" append-icon="mdi-magnify" :items="municipios"
              label="Buscar Lugar De Expedición" item-text="nombre" item-value="id" required>
            </v-autocomplete>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <v-text-field label="Fecha De Nacimiento" type="date" color="primary" v-model="representante.fecha_nac"
              required>
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <v-autocomplete v-model="representante.lugar_nacimiento_id" append-icon="mdi-magnify" :items="municipios"
              label="Buscar Lugar De Nacimiento" item-text="nombre" item-value="id" required>
            </v-autocomplete>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <v-text-field v-model="representante.otra_nacionalidad" label="¿Tiene Otra Nacionalidad?">
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <v-text-field v-model="representante.emali" label="Correo Electronico" required>
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id && informacion.tipo_cliente =='Cliente Usuario Particular'">
            <v-text-field v-model="representante.ocupacion" label="Ocupación, oficio o profesión">
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id && informacion.tipo_cliente =='Cliente Usuario Particular'">
            <v-text-field v-model="representante.donde_trabaja" label="Empresa donde trabaja">
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <v-autocomplete v-model="representante.ciudad_recidencia_id" append-icon="mdi-magnify" :items="municipios"
              label="Buscar Ciudad De Residencia" item-text="nombre" item-value="id" required>
            </v-autocomplete>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <v-autocomplete v-model="representante.deparamento_recidencia_id" append-icon="mdi-magnify"
              :items="departamento" label="Buscar Deparamentos De Residencia" item-text="nombre" item-value="id"
              required>
            </v-autocomplete>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id && informacion.tipo_cliente !='Cliente Usuario Particular'">
            <v-text-field v-model="representante.direccion_reci" label="Dirección Principal:" required>
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <v-text-field v-model="representante.pais_reci" label="Pais De Residencia" required>
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id && informacion.tipo_cliente !='Cliente Usuario Particular'">
            <v-text-field v-model="representante.telefono" label="Numero De Contacto" required>
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <v-label><strong>¿Por Su Cargo O Actividad Maneja Recursos Públicos?</strong>
            </v-label>
            <v-radio-group v-model="representante.cargo_publico">
              <v-radio v-for="n in afirmacion" :key="n.id" :label="`${n.nombre}`" :value="n.id" color="info" required>
              </v-radio>
            </v-radio-group>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <v-label><strong>¿Por Su Cargo O Actividad Ejerce Algún Poder Público?</strong>
            </v-label>
            <v-radio-group v-model="representante.poder_publico">
              <v-radio v-for="n in afirmacion" :key="n.id" :label="`${n.nombre}`" :value="n.id" color="info" required>
              </v-radio>
            </v-radio-group>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <v-label><strong>¿Por Su Actividad U Oficio, Goza Usted De Reconocimiento
                Público
                General?</strong></v-label>
            <v-radio-group v-model="representante.reconocimento_publico">
              <v-radio v-for="n in afirmacion" :key="n.id" :label="`${n.nombre}`" :value="n.id" color="info" required>
              </v-radio>
            </v-radio-group>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <v-label><strong>¿Es Usted Sujeto De Obligaciones Tributarias En Otro País O
                Grupo
                De
                Países?</strong></v-label>
            <v-radio-group v-model="representante.obli_tibutarias">
              <v-radio v-for="n in afirmacion" :key="n.id" :label="`${n.nombre}`" :value="n.id" color="info" required>
              </v-radio>
            </v-radio-group>
            <v-textarea label="Indique El Pais" v-show="parseInt(representante.obli_tibutarias) === 1"
              v-model="representante.descripcion_obliga"></v-textarea>
          </v-col>
        </v-row>
        <v-card-actions v-if="usuario_id">
          <v-spacer></v-spacer>
          <v-btn small color="success" @click="guardarRepresentante()">Guardar</v-btn>
        </v-card-actions>
        <v-row>
          <v-col cols="12" sm="12" md="12" v-if="usuario_id && informacion.tipo_cliente !='Cliente Usuario Particular'">
            <v-alert border="left" text outlined dense icon="mdi-person" color="info">
              <h4>IDENTIFICACIÓN DE LOS SOCIOS,
                ACCIONISTAS O ASOCIADOS</h4>
              <h6>Solo Para Aquellos Que Posean Una
                Participación Mayor Del 5%</h6>
            </v-alert>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id && informacion.tipo_cliente !='Cliente Usuario Particular'">
            <v-text-field v-model="socio.razon_social" label="Razón social o Nombre completo" required>
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id && informacion.tipo_cliente !='Cliente Usuario Particular'">
            <v-select :items="Tipo_Doc" v-model="socio.tipo_doc" label="Tipo de identificación" required>
            </v-select>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id && informacion.tipo_cliente !='Cliente Usuario Particular'">
            <v-text-field v-model="socio.num_doc" label="Número" required>
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id && informacion.tipo_cliente !='Cliente Usuario Particular'">
            <v-text-field v-model="socio.participacion" label="% Participación" required>
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="8" v-if="usuario_id && informacion.tipo_cliente !='Cliente Usuario Particular'">
            <v-select :items="pregunta" v-model="socio.descripcion_expuevincula"
              label="¿Es persona públicamente expuesta, o vinculado con una de ellas?" required>
            </v-select>
          </v-col>
        </v-row>
        <v-card-actions v-if="usuario_id && informacion.tipo_cliente !='Cliente Usuario Particular'">
          <v-spacer></v-spacer>
          <v-btn small color="success" @click="guardarSocio()">Guardar</v-btn>
        </v-card-actions>
        <v-row>
          <v-col cols="12" sm="12" md="12" v-if="usuario_id && informacion.tipo_cliente !='Cliente Usuario Particular'">
            <v-data-table dense :headers="headers" :items="listaSocio">
              <template v-slot:[`item.acciones`]="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="red" class="mr-2" v-bind="attrs" v-on="on" @click="eliminarSocio(item.id)">
                      mdi-delete
                    </v-icon>
                  </template>
                  <span>Eliminar socio</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="12" md="12" v-if="usuario_id && informacion.tipo_cliente !='Cliente Usuario Particular'">
            <v-alert border="left" text outlined dense icon="mdi-person" color="info">
              <h4>Conocimiento mejorado de Personas
                Expuestas Públicamente</h4>
              <h6>Teniendo en cuenta lo anterior,
                complete
                la siguiente información si aplica</h6>
            </v-alert>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id && informacion.tipo_cliente !='Cliente Usuario Particular'">
            <v-text-field v-model="persona_expuesta.razon_social" label="Razón social o Nombre completo" required>
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id && informacion.tipo_cliente !='Cliente Usuario Particular'">
            <v-text-field v-model="persona_expuesta.nacionalidad" label="Nacionalidad" required>
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id && informacion.tipo_cliente !='Cliente Usuario Particular'">
            <v-select :items="vinvulo" v-model="persona_expuesta.relacion" label="Vinculo/Relación" required>
            </v-select>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id && informacion.tipo_cliente !='Cliente Usuario Particular'">
            <v-text-field v-model="persona_expuesta.entidad" label="Entidad" required>
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id && informacion.tipo_cliente !='Cliente Usuario Particular'">
            <v-text-field v-model="persona_expuesta.cargo" label="Cargo" required>
            </v-text-field>
          </v-col>
        </v-row>
        <v-card-actions v-if="usuario_id && informacion.tipo_cliente !='Cliente Usuario Particular'">
          <v-spacer></v-spacer>
          <v-btn small color="success" @click="guardarPersonalExpuesto()">Guardar</v-btn>
        </v-card-actions>
        <v-row>
          <v-col cols="12" sm="12" md="12" v-if="usuario_id && informacion.tipo_cliente !='Cliente Usuario Particular'">
            <v-data-table dense :headers="headers2" :items="listaPersonaExpuesta">
              <template v-slot:[`item.acciones`]="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="red" class="mr-2" v-bind="attrs" v-on="on"
                      @click="eliminarPersonalExpuesto(item.id)">
                      mdi-delete
                    </v-icon>
                  </template>
                  <span>Eliminar</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="12" md="12" v-if="usuario_id">
            <v-alert border="left" text outlined dense icon="mdi-person" color="info">
              <h4>INFORMACIÓN FINACIERA</h4>
            </v-alert>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <v-text-field v-model="informacionFinaciera.total_activos" label="Total Activos (último balance)" required>
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <v-text-field v-model="informacionFinaciera.total_pasivos" label="Total Pasivos (último balance)" required>
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <v-text-field v-model="informacionFinaciera.ingreso_mensual" label="Ingresos Mensuales (promedio mensual)"
              required>
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <v-text-field v-model="informacionFinaciera.otros_ingresos" label="Otros ingresos" required>
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <v-text-field v-model="informacionFinaciera.concepto_ingreso" label="Concepto" required>
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <v-text-field v-model="informacionFinaciera.egresos_mensuales" label="Egresos Mensuales (promedio mensual)"
              required>
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <v-text-field v-model="informacionFinaciera.otros_egresos" label="Otros egresos" required>
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <v-text-field v-model="informacionFinaciera.concepto_egreso" label="Concepto" required>
            </v-text-field>
          </v-col>
        </v-row>
        <v-card-actions v-if="usuario_id">
          <v-spacer></v-spacer>
          <v-btn small color="success" @click="guardarInformacionFinaciera()">Guardar</v-btn>
        </v-card-actions>
        <v-row>
          <v-col cols="12" sm="12" md="12" v-if="usuario_id">
            <v-alert border="left" text outlined dense icon="mdi-person" color="info">
              <h4>ACTIVIDADES EN OPERACIONAES
                INTERNACIONALES</h4>
            </v-alert>
          </v-col>

          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <v-select :items="pregunta" v-model="actividadesInternacionales.transa_monedaextr"
              label="¿Realiza transacciones en moneda extranjera?" required>
            </v-select>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <v-select :items="actividadCual" v-model="actividadesInternacionales.cual_moneda" label="Cuál?" required>
            </v-select>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <v-text-field v-if="actividadesInternacionales.cual_moneda =='OTRAS'"
              v-model="actividadesInternacionales.otra_moneda" label="Indique otras">
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <v-select :items="pregunta" v-model="actividadesInternacionales.produc_extranjeros"
              label="¿Posee productos financieros en el exterior?" required>
            </v-select>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <v-select :items="pregunta" v-model="actividadesInternacionales.cual_prodc"
              label="¿Posee cuentas en moneda extranjera?" required>
            </v-select>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <v-text-field v-model="actividadesInternacionales.pais_operaciones" label="País de operaciones extranjeras"
              required></v-text-field>
          </v-col>

        </v-row>
        <v-card-actions v-if="usuario_id">
          <v-spacer></v-spacer>
          <v-btn small color="success" @click="guardarActividadesInternacionales()">Guardar</v-btn>
        </v-card-actions>
        <v-row>
          <v-col cols="12" sm="12" md="12" v-if="usuario_id">
            <v-alert border="left" text outlined dense icon="mdi-person" color="info">
              <h4>DECLARACIÓN DE ORIGEN DE
                FONDOS</h4>
            </v-alert>
          </v-col>
          <v-col cols="12" sm="12" md="12" v-if="usuario_id">
            <span style="font-size:15px">
              1. Los recursos que poseo provienen de las siguientes fuentes: (Detalle
              ocupación,
              oficio, actividad económica o negocio).
            </span>
          </v-col>
          <v-col cols="12" sm="12" md="12" v-if="usuario_id">
            <v-textarea outlined name="input-7-4" v-model="decalracionFondos.declaracion" required>
            </v-textarea>
          </v-col>
          <v-col cols="12" sm="12" md="12" v-if="usuario_id" style="color:black">
            <span style="font-size:15px">
              2. Tanto mi actividad, profesión u oficio es licita y la ejerzo dentro
              del
              marco
              legal y los recursos que poseo no provienen de actividades ilícitas de
              las
              contempladas en el Código Penal Colombiano.
            </span>
          </v-col>
          <v-col cols="12" sm="12" md="12" v-if="usuario_id" style="color:black">
            <span style="font-size:15px">
              3. La información que he suministrado en la solicitud y en este
              documento es
              veraz y verificable y me obligo a actualizarla anualmente.
            </span>
          </v-col>
          <v-col cols="12" sm="12" md="12" v-if="usuario_id" style="color:black">
            <span style="font-size:15px">
              4. Autorizo a Sumimedical SAS para solicitar, consultar, procesar,
              suministrar,
              reportar o divulgar a cualquier entidad con la que mantenga una relación
              comercial vigente o que se encuentre debidamente autorizada para manejar
              o
              administrar bases de datos, incluidas las entidades gubernamentales, la
              información contenida en este Formulario. De igual forma, autorizo a
              Sumimedical
              SAS a realizar la debida validación en listas restrictivas tanto
              nacionales
              como
              internacionales.
            </span>
          </v-col>
          <v-col cols="12" sm="12" md="10" v-if="usuario_id">

          </v-col>
          <v-col cols="12" sm="12" md="2" v-if="usuario_id">
            <v-dialog v-model="dialog" width="500">
            <template v-slot:activator="{ on }">
              <v-btn color="success" v-on="on" small>Acepto y Autorizo
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="headline red lighten-2 justify-center" style="color:white" primary-title>
                LEER CON ATENCION!
              </v-card-title>

              <v-card-text style="color:black">
                Una vez autorizado, deberá imprimir el formato, firmar y colocar huella del
                representante legal. Adicionalmente, debe adjuntar este formato escaneado con la
                documentación anexa solicitada.
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="success" type="submit" text @click="guardarDeclaracionFondos(), dialog = false">
                  Imprimir y Continuar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          </v-col>
        </v-row>



        <v-row>
          <v-col cols="12" sm="12" md="12" v-if="usuario_id">
            <v-alert border="left" text outlined dense icon="mdi-person" color="info">
              <h4>DOCUMENTACIÓN ANEXA</h4>
            </v-alert>
          </v-col>
          <v-col cols="12" sm="12" md="12" v-if="usuario_id" style="color:black">
            <span style="font-size:15px">
              Este formato debe ser diligenciado en su totalidad y devuelto a Sumimedical SAS
              anexando la siguiente documentación, teniendo en cuenta que según el tipo de
              vinculación se podría solicitar documentación adicional:
            </span>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <span style="color:black">1. Registro Único Tributario - RUT</span>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <input id="registroUnico" ref="registroUnico" type="file" />
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <span style="color:red">Los archivos deben tener un tamaño máximo de 10MB</span>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <span style="color:black">2. Copia cédula representante legal o persona
              natural</span>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <input id="cedualRepresentante" ref="cedualRepresentante" type="file" />
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <span style="color:red">Los archivos deben tener un tamaño máximo de 10MB</span>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <span style="color:black">3. Certificado de existencia y representación legal (menor
              a
              30 días de expedición)</span>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <input id="certificadoRepresentacion" ref="certificadoRepresentacion" type="file" />
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <span style="color:red">Los archivos deben tener un tamaño máximo de 10MB</span>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <span style="color:black">4. Decreto de nombramiento y acta de posesión (para
              entidades
              públicas)</span>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <input id="decretoPosesion" ref="decretoPosesion" type="file" />
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <span style="color:red">Los archivos deben tener un tamaño máximo de 10MB</span>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <span style="color:black">5. Certificación bancaria original de la cuenta inscrita
              en el
              formulario</span>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <input id="certificacionBancaria" ref="certificacionBancaria" type="file" />
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <span style="color:red">Los archivos deben tener un tamaño máximo de 10MB</span>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <span style="color:black">6. Formulario Diligenciado</span>
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <input id="formatoDiligenciado" ref="formatoDiligenciado" type="file" />
          </v-col>
          <v-col cols="12" sm="12" md="4" v-if="usuario_id">
            <span style="color:red">Los archivos deben tener un tamaño máximo de 10MB</span>
          </v-col>
          <v-col cols="12" sm="12" md="12" v-if="usuario_id" style="color:black">
            <span style="font-size:15px">
              Si al momento de diligenciar el formato se presenta cualquier inquietud, por
              favor
              comunicarse al (4) 520 1040 - ext. 105
            </span>
          </v-col>
        </v-row>
        <v-card-actions v-if="usuario_id">
          <v-spacer></v-spacer>
          <v-btn small color="success" @click="guardarAdjuntos()">Guardar</v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </div>
</template>

<script>
  export default {
    name: 'WorkspaceJsonFormularioSarlaft',

    data() {
      return {
        decalracionFondos: {

        },
        dialog: false,
        actividadCual: ['IMPORTACIONES', 'EXPORTACIONES', "TRANSFERENCIAS", "INVERSIONES", "OTRAS"],
        listaPersonaExpuesta: [],
        sarlaft_id: '',
        preload: false,
        municipios: [],
        departamento: [],
        form: {
          cedula: ''
        },
        usuario_id: null,
        tipo_documento: '',
        numero_documento: '',
        nombre: '',
        informacion: {

        },
        actividadesInternacionales: {

        },
        representante: {},
        persona_expuesta: {},
        informacionFinaciera: {},
        socio: {},
        clase: ['Proveedor', 'Cliente', 'Cliente Usuario Particular'],
        tipo_solicitud: ['Vinculacion Primera Vez', 'Actualizacion Novedad', 'Actualizacion Anual'],
        Clase_Prov: ['PROVEEDOR DE PRODUCTOS', 'PROVEEDOR DE SERVICIOS', 'PROVEEDOR DE RECURSOS', 'N/A'],
        Sector_Prov: ['COMERCIO', 'CONSTRUCCION', 'FINANCIERO', 'INDUSTRIAL', 'SERVICIOS', 'SALUD',
          'TRANSPORTE', 'OTROS'
        ],
        vinvulo: ['REPRESENTANTE LEGAL', 'MIEMBRO JUNTA DIRECTIVA', 'ACCIONISTA'],
        Clase_Cli: ['SERVICIOS DE SALUD', 'OTROS', 'N/A'],
        Sector_Cli: ['COMERCIO', 'CONSTRUCCION', 'FINANCIERO', 'INDUSTRIAL', 'SERVICIOS', 'SALUD', 'TRANSPORTE',
          'OTROS'
        ],
        pregunta: ['SI', 'NO'],
        Tipo_Doc: ['CC', 'CE', 'NIT', 'PA'],
        afirmacion: [{
          id: 1,
          nombre: 'SI'
        }, {
          id: 0,
          nombre: 'NO'
        }],
        listaSocio: [],
        headers: [{
            text: 'Razón social o Nombre completo',
            align: 'left',
            sortable: false,
            value: 'razon_social'
          },
          {
            text: 'Tipo de identificación',
            value: 'tipo_doc'
          },
          {
            text: 'Número',
            value: 'num_doc'
          },
          {
            text: '% Participación',
            value: 'participacion'
          },
          {
            text: '¿ Es persona públicamente expuesta, o vinculado con una de ellas?',
            value: 'descripcion_expuevincula'
          },
          {
            text: 'aaciones',
            value: 'acciones'
          },
        ],
        headers2: [{
            text: 'Razón social o Nombre completo',
            align: 'left',
            sortable: false,
            value: 'razon_social'
          },
          {
            text: 'Nacionalidad',
            value: 'nacionalidad'
          },
          {
            text: 'Vinculo/Relación',
            value: 'relacion'
          },
          {
            text: 'Entidad',
            value: 'entidad'
          },
          {
            text: 'Cargo',
            value: 'cargo'
          },
          {
            text: 'aaciones',
            value: 'acciones'
          },
        ],
      };
    },

    mounted() {
      this.listarDepartamentos(
        this.listarMunicipio()
      )
    },

    methods: {
      buscarUsuario() {
        this.preload = true;
        this.$axios.$post('/usuarios/busqueda-usuario', this.form).then(res => {
          if (res.length == 1) {
            this.usuario_id = res[0].id
            this.informacion.user_id = res[0].id
            if (res[0].empleado) {
              this.tipo_documento = res[0].empleado.tipo_documento.nombre
              this.numero_documento = res[0].empleado.documento
              this.nombre = res[0].empleado.nombre_completo
            } else if (res[0].afiliado) {
              this.tipo_documento = res[0].afiliado.tipo_documento.nombre
              this.numero_documento = res[0].afiliado.numero_documento
              this.nombre = res[0].afiliado.nombre_completo
            } else if (res[0].operador) {
              this.tipo_documento = 'NIT'
              this.numero_documento = res[0].operador.prestador.nit
              this.nombre = res[0].operador.prestador.nombre_prestador
            }
          }
          this.preload = false;
        }).catch(e => {
          this.preload = false;
        })
      },

      listarMunicipio() {
        this.$axios.get('municipios/listar').then(res => {
          this.municipios = res.data
        }).catch(e => {})
      },

      listarDepartamentos() {
        this.$axios.get('/departamento/').then(res => {
          this.departamento = res.data
        }).catch(error => {
          console.log(error)
        })
      },

      guardarInformacion() {
        this.preload = true
        this.$axios.$post('/sarlaft/crear', this
          .informacion).then(res => {
          this.$toast.success('Información guardada con exito')
          this.sarlaft_id = res.id
          this.preload = false
        }).catch((e) => {
          this.preload = false
          this.$toast.error(e.response.data.error);
        });
      },

      guardarRepresentante() {
        this.preload = true
        this.representante.sarlaft_id = this.sarlaft_id
        this.$axios.$post('/representante-legal/crear', this
          .representante).then(res => {
          this.$toast.success('Información guardada con exito')
          this.preload = false
        }).catch((e) => {
          this.preload = false
          this.$toast.error(e.response.data.error);
        });
      },

      clearSocio() {
        for (const prop of Object.getOwnPropertyNames(this.socio)) {
          this.socio[prop] = null;
        }
      },

      guardarSocio() {
        this.preload = true
        this.socio.sarlaft_id = this.sarlaft_id
        this.$axios.$post('/socio/crear', this
          .socio).then(res => {
          this.$toast.success('Información guardada con exito')
          this.preload = false
          this.clearSocio()
          this.listarSocio()
        }).catch((e) => {
          this.preload = false
          this.$toast.error(e.response.data.error);
        });
      },

      listarSocio() {
        this.preload = true
        this.$axios.$post('/socio/listar', {
          sarlaft_id: this.sarlaft_id
        }).then(res => {
          this.preload = false
          this.listaSocio = res
        }).catch((e) => {
          this.preload = false
          this.$toast.error(e.response.data.error);
        });
      },

      eliminarSocio(id) {
        this.preload = true
        this.$axios.$post('/socio/inactivar', {
          id: id
        }).then(res => {
          this.$toast.success('Información guardada con exito')
          this.preload = false
          this.listarSocio()
        }).catch((e) => {
          this.preload = false
          this.$toast.error(e.response.data.error);
        });
      },

      clearPersonaExpuesta() {
        for (const prop of Object.getOwnPropertyNames(this.persona_expuesta)) {
          this.persona_expuesta[prop] = null;
        }
      },

      listarPersonalExpuesto() {
        this.preload = true
        this.$axios.$post('/personal-expuesto/listar', {
          sarlaft_id: this.sarlaft_id
        }).then(res => {
          this.preload = false
          this.listaPersonaExpuesta = res
        }).catch((e) => {
          this.preload = false
          this.$toast.error(e.response.data.error);
        });
      },

      guardarPersonalExpuesto() {
        this.preload = true
        this.persona_expuesta.sarlaft_id = this.sarlaft_id
        this.$axios.$post('/personal-expuesto/crear', this
          .persona_expuesta).then(res => {
          this.$toast.success('Información guardada con exito')
          this.preload = false
          this.clearPersonaExpuesta()
          this.listarPersonalExpuesto()
        }).catch((e) => {
          this.preload = false
          this.$toast.error(e.response.data.error);
        });
      },

      eliminarPersonalExpuesto(id) {
        this.preload = true
        this.$axios.$post('/personal-expuesto/inactivar', {
          id: id
        }).then(res => {
          this.$toast.success('Información guardada con exito')
          this.preload = false
          this.listarPersonalExpuesto()
        }).catch((e) => {
          this.preload = false
          this.$toast.error(e.response.data.error);
        });
      },
      guardarInformacionFinaciera() {
        this.preload = true
        this.informacionFinaciera.sarlaft_id = this.sarlaft_id
        this.$axios.$post('/informacion-financiera/crear', this
          .informacionFinaciera).then(res => {
          this.$toast.success('Información guardada con exito')
          this.preload = false
        }).catch((e) => {
          this.preload = false
          this.$toast.error(e.response.data.error);
        });
      },

      guardarActividadesInternacionales() {
        this.preload = true
        this.actividadesInternacionales.sarlaft_id = this.sarlaft_id
        this.$axios.$post('/actividad-internacional/crear', this
          .actividadesInternacionales).then(res => {
          this.$toast.success('Información guardada con exito')
          this.preload = false
        }).catch((e) => {
          this.preload = false
          this.$toast.error(e.response.data.error);
        });
      },

      guardarDeclaracionFondos() {
        this.preload = true
        this.decalracionFondos.sarlaft_id = this.sarlaft_id
        this.$axios.$post('/declaracion-fondo/crear', this
          .decalracionFondos).then(res => {
          this.$toast.success('Información guardada con exito')
          this.preload = false
          this.imprimir()
        }).catch((e) => {
          this.preload = false
          this.$toast.error(e.response.data.error);
        });
      },

      imprimir() {
        const data = {
          tipo: 'Sarlafts',
          id: this.sarlaft_id,
        }
        this.$axios.post('pdf', data, {
          responseType: "arraybuffer"
        }).then(res => {
          let blob = new Blob([res.data], {
            type: "application/pdf"
          });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          window.open(link.href, "_blank");
        });
      },

      guardarAdjuntos() {
        this.preload = true;
        let formData = new FormData();
        formData.append(`registroUnico`, this.$refs.registroUnico.files[0]);
        formData.append(`cedualRepresentante`, this.$refs.cedualRepresentante.files[0]);
        formData.append(`certificadoRepresentacion`, this.$refs.certificadoRepresentacion.files[0]);
        formData.append(`decretoPosesion`, this.$refs.decretoPosesion.files[0]);
        formData.append(`certificacionBancaria`, this.$refs.certificacionBancaria.files[0]);
        formData.append(`formatoDiligenciado`, this.$refs.formatoDiligenciado.files[0]);
        this.$axios.$post('/adjunto-sarlaft/crear/'+ this.sarlaft_id, formData).then(res => {
          this.$toast.success('Información guardada con exito')
          this.preload = false
        }).catch((e) => {
          this.preload = false
          this.$toast.error(e.response.data.error);
        });
      },
    },
  };

</script>

<style scoped>

</style>
