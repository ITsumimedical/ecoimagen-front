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
    <v-dialog v-model="dialogo" persistent max-width="1400px">
      <v-card>
        <v-alert dense text outlined color="primary" icon="mdi-order-bool-descending-variant" class="text-center">
          <b>Verificacion de la información</b>
        </v-alert>
        <v-card-text>
          <v-row dense>
            <v-col cols="12" sm="12" md="12">
              <v-alert dense text outlined color="primary" icon="mdi-order-bool-descending-variant" class="text-center">
                <b>Información General</b>
              </v-alert>
            </v-col>
            <v-col cols="12" sm="12" md="4">
              <v-text-field v-model="informacion.tipo_cliente" readonly label="¿Tipo cliente o proveedor?">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4">
              <v-text-field v-model="informacion.nombre_diligencia" readonly label="Nombre De Quien Diligencia">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4">
              <v-text-field v-model="informacion.cedula_diligencia" readonly label="Numero de Identificacion">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4" v-if="informacion.tipo_cliente !='Cliente Usuario Particular'">
              <v-text-field v-model="informacion.cargo_diligencia" readonly label="Cargo">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4">
              <v-text-field v-model="informacion.tipo_doc" readonly label="Tipo De Documento">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4">
              <v-text-field v-model="informacion.cedula" readonly label="Numero De Documento">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4">
              <v-text-field v-model="informacion.name" readonly label="Nombre/Razón Social:">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4">
              <v-text-field v-model="informacion.tipo_cliente" readonly label="Tipo Cliente:">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4">
              <v-text-field v-model="informacion.sector" readonly label="Sector:">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4" v-if="informacion.tipo_cliente !='Cliente Usuario Particular'">
              <v-text-field v-model="informacion.cual_descripcion" readonly label="¿Cual?:">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4">
              <v-text-field v-model="informacion.tipo_bienservicio" readonly
                label="Tipo bien/servicio a adquirir o proveer:">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4" v-if="informacion.tipo_cliente !='Cliente Usuario Particular'">
              <v-text-field v-model="informacion.direccion" readonly label="Dirección Principal:">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4" v-if="informacion.tipo_cliente !='Cliente Usuario Particular'">
              <v-text-field v-model="informacion.municipio" readonly label="Municipio:">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4" v-if="informacion.tipo_cliente !='Cliente Usuario Particular'">
              <v-text-field v-model="informacion.departamento" readonly label="Departamento:">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4">
              <v-text-field v-model="informacion.email_empresa" readonly label="Correo Electronico:">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4">
              <v-text-field v-model="informacion.telefono_empresa" readonly label="Telefono:">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4">
              <v-text-field v-model="informacion.numero_contacto" readonly label="Numero De Contacto:">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4" v-if="informacion.tipo_cliente !='Cliente Usuario Particular'">
              <v-text-field v-model="informacion.fax" readonly label="Fax:">
              </v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="12" md="12" v-if="informacion.tipo_cliente !='Cliente Usuario Particular'">
              <v-alert dense text outlined color="primary" icon="mdi-order-bool-descending-variant" class="text-center">
                <b>Representante legal</b>
              </v-alert>
            </v-col>
            <v-col cols="12" sm="12" md="12" v-if="informacion.tipo_cliente =='Cliente Usuario Particular'">
              <v-alert dense text outlined color="primary" icon="mdi-order-bool-descending-variant" class="text-center">
                <b>INFORMACION COMPLEMENTARIA</b>
              </v-alert>
            </v-col>
            <v-col cols="12" sm="12" md="4" v-if="informacion.tipo_cliente !='Cliente Usuario Particular'">
              <v-text-field v-model="representanteLegal.nombre" readonly label="Nombre Completo:">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4" v-if="informacion.tipo_cliente !='Cliente Usuario Particular'">
              <v-text-field v-model="representanteLegal.tipo_doc" readonly label="Tipo documento:">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4" v-if="informacion.tipo_cliente !='Cliente Usuario Particular'">
              <v-text-field v-model="representanteLegal.num_doc" readonly label="Numero:">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4">
              <v-text-field v-model="representanteLegal.fecha_exp" readonly label="Fecha De Expedición">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4" v-if="informacion.tipo_cliente !='Cliente Usuario Particular'">
              <v-text-field v-model="representanteLegal.lugarExpedicion" readonly label="Lugar De Expedición">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4">
              <v-text-field v-model="representanteLegal.fecha_nac" readonly label="Fecha De Nacimiento">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4">
              <v-text-field v-model="representanteLegal.lugarNacimiento" readonly label="Lugar De Nacimiento">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4">
              <v-text-field v-model="representanteLegal.otra_nacionalidad" readonly label="¿Tiene Otra Nacionalidad?">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4">
              <v-text-field v-model="representanteLegal.emali" readonly label="Correo Electronico">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4">
              <v-text-field v-model="representanteLegal.ciudadResidencia" readonly label="Ciudad De Residencia">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4">
              <v-text-field v-model="representanteLegal.departamentoResidencia" readonly
                label="Departamento De Residencia">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4" v-if="informacion.tipo_cliente !='Cliente Usuario Particular'">
              <v-text-field v-model="representanteLegal.direccion_reci" readonly label="Dirección Principal:">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4">
              <v-text-field v-model="representanteLegal.pais_reci" readonly label="Pais De Residencia">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4" v-if="informacion.tipo_cliente !='Cliente Usuario Particular'">
              <v-text-field v-model="representanteLegal.telefono" readonly label="Numero De Contacto">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4">
              <v-text-field v-model="representanteLegal.cargo_publico" readonly
                label="¿Por Su Cargo O Actividad Maneja Recursos Públicos?" required>
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4">
              <v-text-field v-model="representanteLegal.poder_publico" readonly
                label="¿Por Su Cargo O Actividad Ejerce Algún Poder Público?" required>
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4">
              <v-text-field v-model="representanteLegal.reconocimento_publico" readonly
                label="¿Por Su Actividad U Oficio, Goza Usted De Reconocimiento Público General?" required>
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4">
              <v-text-field v-model="representanteLegal.obli_tibutarias" readonly
                label="¿Es Usted Sujeto De Obligaciones Tributarias En Otro País O Grupo De Países?" required>
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4">
              <v-text-field v-model="representanteLegal.descripcion_obliga" readonly label="Indique El Pais" required>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="12" md="12" v-if="informacion.tipo_cliente !='Cliente Usuario Particular'">
              <v-alert dense text outlined color="primary" icon="mdi-order-bool-descending-variant" class="text-center">
                <b>IDENTIFICACIÓN DE LOS SOCIOS,
                  ACCIONISTAS O ASOCIADOS</b>
              </v-alert>
            </v-col>
            <v-col cols="12" sm="12" md="12" v-if="informacion.tipo_cliente !='Cliente Usuario Particular'">
              <v-data-table :headers="headers1" :items="socios" dense>
              </v-data-table>
            </v-col>
            <v-col cols="12" sm="12" md="12" v-if="informacion.tipo_cliente !='Cliente Usuario Particular'">
              <v-alert dense text outlined color="primary" icon="mdi-order-bool-descending-variant" class="text-center">
                <b>CONOCIMIENTO MEJORADO DE PERSONAS EXPUESTAS
                  PÚBLICAMENTE</b>
              </v-alert>
            </v-col>
            <v-col cols="12" sm="12" md="12" v-if="informacion.tipo_cliente !='Cliente Usuario Particular'">
              <v-data-table :headers="headers2" :items="personalExpuesto" dense>
              </v-data-table>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="12" md="12">
              <v-alert dense text outlined color="primary" icon="mdi-order-bool-descending-variant" class="text-center">
                <b>INFORMACIÓN FINACIERA</b>
              </v-alert>
            </v-col>
            <v-col cols="12" sm="12" md="4">
              <v-text-field v-model="informacionFinanciera.total_activos" readonly
                label="Total Activos (último balance)">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4">
              <v-text-field v-model="informacionFinanciera.total_pasivos" readonly
                label="Total Pasivos (último balance)">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4">
              <v-text-field v-model="informacionFinanciera.ingreso_mensual" readonly
                label="Ingresos Mensuales (promedio mensual)">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4">
              <v-text-field v-model="informacionFinanciera.otros_ingresos" readonly label="Otros ingresos">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4">
              <v-text-field v-model="informacionFinanciera.concepto_ingreso" readonly label="Concepto de ingresos">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4">
              <v-text-field v-model="informacionFinanciera.egresos_mensuales" readonly
                label="Egresos Mensuales (promedio mensual)">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4">
              <v-text-field v-model="informacionFinanciera.otros_egresos" readonly label="Otros egresos">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4">
              <v-text-field v-model="informacionFinanciera.concepto_egreso" readonly label="Concepto de egresos">
              </v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="12" md="12">
              <v-alert dense text outlined color="primary" icon="mdi-order-bool-descending-variant" class="text-center">
                <b>ACTIVIDADES EN OPERACIONAES
                  INTERNACIONALES</b>
              </v-alert>
            </v-col>
            <v-col cols="12" sm="12" md="4">
              <v-text-field v-model="operacionesInternacionales.transa_monedaextr" readonly
                label="¿Realiza transacciones en moneda extranjera?">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4">
              <v-text-field v-model="operacionesInternacionales.cual_moneda" readonly label="¿Cuál?">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4">
              <v-text-field v-model="operacionesInternacionales.otra_moneda" readonly label="Indique otras">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4">
              <v-text-field v-model="operacionesInternacionales.produc_extranjeros" readonly
                label="¿Posee productos financieros en el exterior?">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4">
              <v-text-field v-model="operacionesInternacionales.cual_prodc" readonly
                label="¿Posee cuentas en moneda extranjera?">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="4">
              <v-text-field v-model="operacionesInternacionales.pais_operaciones" readonly
                label="País de operaciones extranjeras">
              </v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="12" md="12">
              <v-alert dense text outlined color="primary" icon="mdi-order-bool-descending-variant" class="text-center">
                <b>DECLARACIÓN DE ORIGEN DE
                  FONDOS</b>
              </v-alert>
            </v-col>
            <v-col cols="12" sm="12" md="12">
              <v-textarea outline name="input-7-4" v-model="declaracion.declaracion" readonly>
              </v-textarea>
            </v-col>
            <v-col cols="12" sm="12" md="12">
              <v-btn v-for="(data, index) in adjuntosSarlaft" :key="index" color="info">
                <v-icon color="white">mdi-cloud-upload
                </v-icon>
                <a @click="imprimirAdjunto(data.ruta)"  style="color:white">
                  Adjunto
                  {{data.nombre}}
                </a>
              </v-btn>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12" sm="12" md="12" v-for="(revisionSarlaft, index) in revisionSarlaft"
              :key="revisionSarlaft.id">
              <v-alert dense text outlined color="primary" icon="mdi-order-bool-descending-variant" class="text-center"
                v-if="revisionSarlaft">
                <b>REVISION # {{index+1}}</b>
              </v-alert>
            </v-col>
            <v-col cols="12" sm="12" md="12" v-if="revisionSarlaft">
              <v-textarea outline name="input-7-4" v-model="revisionSarlaft.revision" readonly>
              </v-textarea>
              <span> <strong>Hora y Fecha: </strong>{{revisionSarlaft.created_at}}</span>
              <span><strong>Usuario que revisa:
                </strong>
                <!--{{revisionSarlaft.name +' '+ revisionSarlaft.apellido}}-->
              </span>

              <v-spacer></v-spacer>

              <v-col cols="12" sm="12" md="12" xs12 v-for="(data, index) in revisionSarlaft.adjuntos" :key="index">
                <v-btn color="info" v-if="data.ruta != null">
                  <v-icon color="white">mdi-cloud-upload
                  </v-icon>
                  <a @click="imprimirAdjunto(data.ruta)" target="_blank" style="color:white">
                    Adjunto
                    {{data.nombre}}
                  </a>
                </v-btn>
              </v-col>
            </v-col>
          </v-row>

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small color="error" @click="dialogo = false">
            Cancelar
          </v-btn>
          <v-btn small color="primary" @click="imprimir()">
            Imprimir
          </v-btn>
        </v-card-actions>
      </v-card>

    </v-dialog>
    <v-card>
      <v-card-text>
        <v-row>
          <v-col  cols="12" sm="12" md="12">
            <v-data-table dense :headers="headers" :items="listaSarlaft" disable-pagination hide-default-footer>
              <template v-slot:[`item.nombreSarlaft`]="{ item }">
                <td v-if="item.user.tipo_usuario_id == 2">
                  {{item.user.afiliado.nombre_completo }}
                </td>
                <td v-else-if="item.user.tipo_usuario_id == 1" class="text-xs-center">
                  {{item.user.empleado.nombre_completo }}
                </td>
                <td v-else>
                  {{item.user.operador.prestador.nombre_prestador }}
                </td>
              </template>
              <template v-slot:[`item.cedula`]="{ item }">
                <td v-if="item.user.tipo_usuario_id == 2">
                  {{item.user.afiliado.numero_documento }}
                </td>
                <td v-else-if="item.user.tipo_usuario_id == 1" class="text-xs-center">
                  {{item.user.empleado.documento }}
                </td>
                <td v-else>
                  {{item.user.operador.prestador.nit }}
                </td>
              </template>
              <template v-slot:[`item.created_at`]="{ item }">
                <td>
                  {{item.created_at.substring(0,10) }}
                </td>
              </template>
              <template v-slot:[`item.acciones`]="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="primary" class="mr-2" v-bind="attrs" v-on="on" @click="informacionMostrar(item)">
                      mdi-eye
                    </v-icon>
                  </template>
                  <span>Ver </span>
                </v-tooltip>

              </template>
            </v-data-table>
            <v-row no-gutters>
              <v-col md="9" lg="9" xl="11" sm="11" class="px-2">
                <v-pagination v-model="paginaOrden" class="my-4" :length="totalOrden" :total-visible="9"
                  @input="listarSarlaft()">
                </v-pagination>
              </v-col>
              <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
                <v-select class="my-4" v-model="opcionActualOrden" :items="opcionesOrden" dense solo small
                  @change="listarSarlaft()">
                </v-select>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  export default {
    name: 'WorkspaceJsonSarlaftPendientes',

    data() {
      return {
        listaSarlaft: [],
        preload: false,
        headers: [{
            text: 'ID Registro',
            sortable: false,
            value: 'id'
          },

          {
            text: 'Nombre del Proveedor',
            align: 'left',
            value: 'nombreSarlaft'
          },
          {
            text: 'CEDULA / NIT',
            value: 'cedula'

          },
          {
            text: 'CLIENTE / PROVEEDOR',
            value: 'tipo_cliente'

          },

          {
            text: 'Correo Electronico',
            value: 'email_empresa'

          },
          {
            text: 'Fecha de llenado',
            value: 'created_at'

          },
          {
            text: 'Acciones',
            value: 'acciones'

          },
        ],
        paginaOrden: 1,
        totalOrden: 0,
        opcionesOrden: [5, 10, 20, 50, 100],
        opcionActualOrden: 5,
        informacion: {
          tipo_solicitud: null,
          tipo_cliente: null,
          clase: null,
          municipio: null,
          sector: null,
          cual_descripcion: null,
          tipo_bienservicio: null,
          direccion: null,
          nombre_diligencia: null,
          cedula_diligencia: null,
          cargo_diligencia: null,
          departamento: null,
          email_empresa: null,
          telefono_empresa: null,
          fax: null,
          numero_contacto: null,
          user_id: null,
        },
        representanteLegal: {},
        socios: [],
        personalExpuesto: [],
        informacionFinanciera: {},
        operacionesInternacionales: {},
        declaracion: {},
        idSarlaft: null,
        revisionSarlaft: [],
        dialogo: false,
        headers1: [{
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
        ],
        headers2: [{
            text: 'Razón social o Nombre completo',
            align: 'left',
            sortable: false,
            value: 'razon_social',
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
        ],
        adjuntosSarlaft: [],
        revision: {}
      };
    },

    mounted() {

    },

    methods: {
      listarSarlaft() {
        this.preload = true
        this.$axios.post('sarlaft/listarRevisados?page=' + this.paginaOrden + '&cant=' + this
          .opcionActualOrden).then(res => {
          this.listaSarlaft = res.data.data
          this.totalOrden = res.data.last_page;
          this.preload = false
        }).catch(e => {
          this.preload = false
        })
      },


      informacionMostrar(item) {
        this.idSarlaft = item.id
        this.dialogo = true
        this.informacion.tipo_solicitud = item.tipo_solicitud
        this.informacion.tipo_cliente = item.tipo_cliente
        this.informacion.clase = item.clase
        this.informacion.municipio = item.municipio.nombre
        this.informacion.sector = item.sector
        this.informacion.cual_descripcion = item.cual_descripcion
        this.informacion.tipo_bienservicio = item.tipo_bienservicio
        this.informacion.direccion = item.direccion
        this.informacion.nombre_diligencia = item.nombre_diligencia
        this.informacion.cedula_diligencia = item.cedula_diligencia
        this.informacion.cargo_diligencia = item.cargo_diligencia
        this.informacion.departamento = item.departamento.nombre
        this.informacion.email_empresa = item.email_empresa
        this.informacion.telefono_empresa = item.telefono_empresa
        this.informacion.fax = item.fax
        this.informacion.numero_contacto = item.numero_contacto

        this.representanteLegal = item.representante_legal
        if (item.representante_legal.cargo_publico == 0) {
          this.representanteLegal.cargo_publico = 'NO'
        } else {
          this.representanteLegal.cargo_publico = 'SI'
        }
        if (item.representante_legal.poder_publico == 0) {
          this.representanteLegal.poder_publico = 'NO'
        } else {
          this.representanteLegal.poder_publico = 'SI'
        }
        if (item.representante_legal.reconocimento_publico == 0) {
          this.representanteLegal.reconocimento_publico = 'NO'
        } else {
          this.representanteLegal.reconocimento_publico = 'SI'
        }
        if (item.representante_legal.obli_tibutarias == 0) {
          this.representanteLegal.obli_tibutarias = 'NO'
        } else {
          this.representanteLegal.obli_tibutarias = 'SI'
        }
        this.representanteLegal.lugarNacimiento = item.representante_legal.lugar_nacimiento.nombre
        this.representanteLegal.lugarExpedicion = item.representante_legal.lugar_expedicion.nombre
        this.representanteLegal.ciudadResidencia = item.representante_legal.ciudad_residencia.nombre
        this.representanteLegal.departamentoResidencia = item.representante_legal.departamento_residencia.nombre
        this.socios = item.socios
        this.personalExpuesto = item.personal_expuesto
        this.informacionFinanciera = item.informacion_financiera
        this.operacionesInternacionales = item.actividad_financiera
        this.declaracion = item.declaracion_fondo
        this.revisionSarlaft = item.revision_sarlaft
        this.adjuntosSarlaft = item.adjunto_sarlaft
      },

      imprimir() {
        const data = {
          tipo: 'Sarlafts',
          id: this.idSarlaft,
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

       async imprimirAdjunto(ruta) {
        try {
          let adj = await this.$adjuntos(ruta);
          let blob = new Blob([adj[1]], {
            type: adj[0],
          });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          window.open(link.href, "_blank");
        } catch (error) {
          this.$toast.error('El adjunto de la factura no existe!')
          console.log(error.response);
        }
      },


    },
  };

</script>
