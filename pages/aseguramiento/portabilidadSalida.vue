<template>
  <div>
    <v-data-table :headers="headers" :search="buscarProveedor" :items="listaProveedores" sort-by="id"
      class="elevation-1" :loading="loading" loading-text="Cargando..." hide-default-footer>
      <template v-slot:[`item.capitado`]="{ item }">{{ item.capitado == true ? 'Si' : 'No' }}
      </template>
      <template v-slot:top>
        <v-card-title>
          <v-btn color="success" dark class="mb-2 white--text" @click="modalAbrirPortabilidad()">
            Crear
            <v-icon right dark>
              mdi-plus-circle-outline
            </v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field v-model="buscarProveedor" label="Buscar" append-icon="mdi-magnify" hide-details single-line>
          </v-text-field>
        </v-card-title>
        <v-dialog v-model="dialogo" fullscreen persistent>
          <v-card>
            <v-card-title class="card">
              <span style="color:white" class="text-h5">Crear Portabilidad Salida</span>
            </v-card-title>
            <v-card-text>
              <v-container fluid>
                <v-row justify="center">
                  <v-col cols="12" sm="auto" md="3">
                    <v-autocomplete :items="tipoDocumento" v-model="portabilidad.tipo_documento" item-text="nombre"
                      item-value="id" label="Seleccione Tipo de documento" :error-messages="errors.tipo_documento">
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="auto" md="3">
                    <v-text-field v-model="portabilidad.numero_documento" label="Numero Documento"
                      :error-messages="errors.numero_documento"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field v-model="portabilidad.primer_nombre" label="Primer nombre"
                      :error-messages="errors.primer_nombre"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field v-model="portabilidad.segundo_nombre" label="Segundo nombre"
                      :error-messages="errors.segundo_nombre"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field v-model="portabilidad.primer_apellido" label="Primer apellido"
                      :error-messages="errors.primer_apellido"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field v-model="portabilidad.segundo_apellido" label="Segundo apellido"
                      :error-messages="errors.segundo_apellido"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-autocomplete :items="regiones" v-model="portabilidad.region" label="Región"
                      :error-messages="errors.region"></v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="6" md="9">
                    <v-autocomplete :items="ut" v-model="portabilidad.ut" label="Asegurador"
                      :error-messages="errors.ut"></v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-autocomplete :items="sexo" v-model="portabilidad.sexo" label="sexo"
                      :error-messages="errors.sexo"></v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field v-model="portabilidad.fecha_nacimiento" label="Fecha nacimiento" type="date"
                      :error-messages="errors.fecha_nacimiento">
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field v-model="portabilidad.fecha_afiliacion" label="Fecha afiliación" type="date"
                      :error-messages="errors.fecha_afiliacion">
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-autocomplete :items="TipoAfiliado" v-model="portabilidad.tipo_afiliacion" label="Tipo afiliación"
                      :error-messages="errors.tipo_afiliacion"></v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field v-model="portabilidad.parentesco" label="parentesco"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field v-model="portabilidad.tipo_documento_cotizante" label="Tipo documento cotizante">
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field v-model="portabilidad.numero_documento_cotizante" label="Documento cotizante">
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field v-model="portabilidad.tipo_cotizante" label="Tipo cotizante"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field v-model="portabilidad.estado_afiliacion" label="Estado afiliación"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-title class="card">
              <span style="color:white" class="text-h5">Datos Portabilidad</span>
            </v-card-title>
            <v-card-text>
              <v-container fluid>
                <v-row>
                  <v-col cols="12" sm="6" md="3">
                    <v-autocomplete :items="departamentos" v-model="portabilidad.departamento_receptor"
                      item-text="nombre" item-value="id" label="Departamento Receptor"></v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-autocomplete :items="municipios" v-model="portabilidad.municipio_receptor"
                      label="Municipio Receptor"></v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-autocomplete :items="utPortabilidad" v-model="portabilidad.entidad_receptora" item-text="nombre"
                      item-value="id" label="Entidad Receptora"></v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field v-model="portabilidad.fecha_inicio" label="Fecha inicial portabilidad" type="date">
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field v-model="portabilidad.fecha_final" label="Fecha final portabilidad" type="date">
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <v-autocomplete :items="motivos" v-model="portabilidad.motivos" item-text="nombre" item-value="id"
                      label="Motivo"></v-autocomplete>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" @click="cerrar()">
                Cancelar
              </v-btn>
              <v-btn color="primary">
                Guardar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon small color="warning">
                mdi-pencil
              </v-icon>
            </v-btn>
          </template>
          <span>Editar</span>
        </v-tooltip>
      </template>
      <template v-slot:no-data>
        No hay información para mostrar
      </template>
    </v-data-table>
    <template>
      <div class="text-center">
        <v-pagination v-model="paginate.page" :length="paginate.total" :total-visible="7" @input="listarPrestador()">
        </v-pagination>
      </div>
    </template>
  </div>
</template>

<script>
  // import {
  //   listarPrestador,
  // } from '@/api/admin/proveedores/prestador'
  // import CrearProveedoresComponent from '@/components/admin/proveedores/CrearProveedores.vue'
  // import EditarProveedoresComponent from '@/components/admin/proveedores/EditarProveedores.vue'

  export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
    // components: {
    //   CrearProveedoresComponent,
    //   EditarProveedoresComponent
    // },

    data() {
      return {
        datos: {},
        loading: false,
        dialogo: false,
        componente: null,
        buscarProveedor: '',
        listaProveedores: [],
        paginate: {
          total: 0,
          page: 1
        },
        departamento:[],
        municipios:[],
        errors:{},
        headers: [{
            text: 'id',
            align: 'start',
            sortable: false,
            value: 'id',
          },
          {
            text: 'Código',
            value: 'codigo'
          },
          {
            text: 'Nombre',
            value: 'nombre'
          },
          {
            text: 'Nit',
            value: 'nit'
          },
          {
            text: 'Dirección',
            value: 'direccion'
          },
          {
            text: 'Correo',
            value: 'email_1'
          },
          {
            text: 'Telefono',
            value: 'email_1'
          },
          {
            text: 'Capitado',
            value: 'capitado'
          },
          {
            text: 'Acciones',
            value: 'actions',
            sortable: false
          },
        ],
        regiones: ['Región 1', 'Región 2', 'Región 3', 'Región 4', 'Región 5', 'Región 6', 'Región 7', 'Región 8',
          'Región 9', 'Región 10'
        ],
        ut: ['UNION TEMPORAL TOLIHUILA',
          'COSMITET LTDA CORPORACION DE SERVICIOS MEDICOS INTERNANCIONALES THEM Y CIA LTDA',
          'UNION TEMPORAL SALUDSUR2', 'MEDISALUD UT', 'UNION TEMPORAL DEL NORTE REGION CINCO',
          'ORGANIZACIÓN CLINICA GENERAL DEL NORTE S.A.', 'UT RED INTEGRADA FOSCAL - CUB', 'REDVITAL UT',
          'COSMITET LTDA. CORPORACION DE SERVICIOS MEDICOS INTERNACIONALES THEM Y CIA LTDA',
          'UNIÓN TEMPORAL SERVISALUD SAN JOSÉ'
        ],
        tipoDocumento: ['RC', 'TI', 'CC', 'CE', 'PA', 'CN', 'PE', 'SA'],
        sexo: ['M', 'F'],
        parentesco: ['Padre o Madre', 'Hijo Docente', 'NO APLICA', 'Conyuge o Compañero', 'Hijo Conyuge',
          'Hijo Adoptivo', 'Hijo Discapacitado', 'Otro', 'Nieto menor o igual a 30 días'
        ],
        TipoCotizante: ['Cotizante docente', 'Cotizante Fallecido', 'Cotizante Pensionado', 'Beneficiario',
          'Sustituto Pensional'
        ],
        TipoAfiliado: ['BENEFICIARIO', 'COTIZANTE', 'Cotizante Fallecido', 'Sustituto Pensional',
          'Cotizante Pensionado', 'Cotizante Dependiente'
        ],
        estados: [],
        discapacidad: ['Sin discapacidad', 'Mental/psíquica', 'Física', 'Auditiva', 'Visual',
          'Sordo - Ceguera'
        ],
        gradoDiscapacidad: ['Moderada', 'Leve', 'Severa'],
        utPortabilidad: [{
            'id': 1,
            'nombre': 'Unión Temporal Tolihuila'
          },
          {
            'id': 2,
            'nombre': 'Cosmitet Región 2'
          },
          {
            'id': 3,
            'nombre': 'Unión Temporal Salud Sur 2'
          },
          {
            'id': 4,
            'nombre': 'Unión Temporal Medisalud'
          },
          {
            'id': 5,
            'nombre': 'Unión Temporal del Norte Región 5'
          },
          {
            'id': 6,
            'nombre': 'Organización clínica general del norte'
          },
          {
            'id': 7,
            'nombre': 'Unión Temporal Red Integrada Foscal-CUB'
          },
          {
            'id': 8,
            'nombre': 'Red Vital UT'
          },
          {
            'id': 9,
            'nombre': 'Cosmitet Región 9'
          },
          {
            'id': 10,
            'nombre': 'Unión Temporal Servisalud San Jose'
          }
        ],
        departamentos: [{
            'id': '05',
            'nombre': 'ANTIOQUIA'
          },
          {
            'id': '08',
            'nombre': 'ATLANTICO'
          },
          {
            'id': 11,
            'nombre': 'BOGOTA'
          },
          {
            'id': 13,
            'nombre': 'BOLIVAR'
          },
          {
            'id': 15,
            'nombre': 'BOYACA'
          },
          {
            'id': 17,
            'nombre': 'CALDAS'
          },
          {
            'id': 18,
            'nombre': 'CAQUETA'
          },
          {
            'id': 19,
            'nombre': 'CAUCA'
          },
          {
            'id': 20,
            'nombre': 'CESAR'
          },
          {
            'id': 23,
            'nombre': 'CORDOBA'
          },
          {
            'id': 25,
            'nombre': 'CUNDINAMARCA'
          },
          {
            'id': 27,
            'nombre': 'CHOCO'
          },
          {
            'id': 41,
            'nombre': 'HUILA'
          },
          {
            'id': 44,
            'nombre': 'LA GUAJIRA'
          },
          {
            'id': 47,
            'nombre': 'MAGDALENA'
          },
          {
            'id': 50,
            'nombre': 'META'
          },
          {
            'id': 52,
            'nombre': 'NARINO'
          },
          {
            'id': 54,
            'nombre': 'NORTE DE SANTANDER'
          },
          {
            'id': 63,
            'nombre': 'QUINDIO'
          },
          {
            'id': 66,
            'nombre': 'RISARALDA'
          },
          {
            'id': 68,
            'nombre': 'SANTANDER'
          },
          {
            'id': 70,
            'nombre': 'SUCRE'
          },
          {
            'id': 73,
            'nombre': 'TOLIMA'
          },
          {
            'id': 76,
            'nombre': 'VALLE DEL CAUCA'
          },
          {
            'id': 81,
            'nombre': 'ARAUCA'
          },
          {
            'id': 85,
            'nombre': 'CASANARE'
          },
          {
            'id': 86,
            'nombre': 'PUTUMAYO'
          },
          {
            'id': 88,
            'nombre': 'SAN ANDRES'
          },
          {
            'id': 91,
            'nombre': 'AMAZONAS'
          },
          {
            'id': 94,
            'nombre': 'GUAINIA'
          },
          {
            'id': 95,
            'nombre': 'GUAVIARE'
          },
          {
            'id': 97,
            'nombre': 'VAUPES'
          },
          {
            'id': 99,
            'nombre': 'VICHADA'
          }
        ],
        motivos: [{
            'id': 1,
            'nombre': 'Comision de Estudios'
          },
          {
            'id': 2,
            'nombre': 'Vacaciones'
          },
          {
            'id': 3,
            'nombre': 'Licencia de maternidad'
          },
          {
            'id': 4,
            'nombre': 'Razones Familiares'
          },
          {
            'id': 5,
            'nombre': 'Otra'
          }
        ],
        portabilidad: [{
          primer_nombre: '',
          segundo_nombre: '',
          primer_apellido: '',
          segundo_apellido: '',
          region: '',
          ut: '',
          tipo_documento: '',
          numero_documento: '',
          sexo: '',
          fecha_nacimiento: '',
          edad_cumplida: '',
          fecha_afiliacion: '',
          tipo_afiliacion: '',
          orden_judicial: '',
          numero_folio: '',
          fecha_emision: '',
          parentesco: '',
          tipo_documento_cotizante: '',
          numero_documento_cotizante: '',
          tipo_cotizante: '',
          estado_afiliacion: '',
          dane_municipio: '',
          municipio_afiliacion: '',
          dane_departamento: '',
          departamento_afiliacion: '',
          subregion: '',
          departamento_atencion: '',
          municipio_atencion: '',
          ips: '',
          sede_odontologica: '',
          discapacidad: '',
          grado_discapacidad: '',
          email: '',
          password: '',
        }]
      };
    },

    mounted() {
      this.listarPrestador();
    },

    methods: {

      cerrar() {
        this.dialogo = false
      },

      modalAbrirPortabilidad() {
        this.dialogo = true
      },

      async listarPrestador() {
        this.loading = true
        try {
          const {
            data
          } = await this.$loadingGetRequest(listarPrestador(this.paginate.page))
          this.listaProveedores = data.data.data
          this.paginate.total = data.data.last_page
          this.paginate.page = data.data.current_page
          this.loading = false
        } catch (error) {
          this.loading = false

        }
      },

       /**
       * listar municipio con filer de departamento
       * @param data number
       * @return municipio objeto
       * @author kobatime
       */
       listarMunicipios(data) {
        return this.departamento.filter((item => item.id == data)).map((municipios) => {
          return this.municipio = municipios.municipios
        })
      },

      /**
       * codigo dane del departamento con filer de departamento
       * @param data number
       * @return portabilidad.dane_departamento dato
       * @author kobatime
       */
      departamentosCodigo(data) {
        return this.departamento.filter((item => item.id == data)).map((codigo) => {
          return this.portabilidad.dane_departamento = codigo.codigo_dane
        })
      },

      /**
       * codigo dane del municipio con filer de departamento
       * @param data number
       * @return portabilidad.dane_municipio dato
       * @author kobatime
       */
      municipioCodigo(data) {
        return this.municipio.filter((item => item.id == data)).map((codigo) => {
          return this.portabilidad.dane_municipio = codigo.codigo_dane
        })
      },

      /**
       * listar departamentos
       * @return departamento objeto
       * @author kobatime
       */
      async listarDepartamentos() {
        try {
          const {
            data
          } = await this.$loadingGetRequest(listarDepartamento())
          this.departamento = data
        } catch (error) {
          console.log(error)
        }
      },

    },
  };

</script>
