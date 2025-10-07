<template>
    <div>
      <!-- Preload -->
      <v-dialog v-model="preload" persistent width="300">
        <v-card color="primary" dark>
          <v-card-text>
            Tranquilo procesamos tu solicitud!
            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="dialogCum"
        persistent
        max-width="990"
      >
        <v-card>
            <v-alert dense text border="left" icon="mdi-medication" type="info" color="info">
            Crear Expediente
          </v-alert>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Expediente *" v-model="cum.expediente" :error-messages="errors.expediente"  dense></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Producto *" v-model="cum.producto" :error-messages="errors.producto"  dense></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Titular *" v-model="cum.titular" :error-messages="errors.titular"  dense></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Registro Sanitario" v-model="cum.registro_sanitario" :error-messages="errors.registro_sanitario"  dense></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field type="date" label="Fecha Expedicion" v-model="cum.fecha_expedicion" :error-messages="errors.fecha_expedicion"  dense></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field  type="date" label="Fecha Vencimiento" v-model="cum.fecha_vencimiento" :error-messages="errors.fecha_vencimiento"  dense></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Expediente Cum" v-model="cum.expediente_cum" :error-messages="errors.expediente_cum"  dense></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Consecutivo Cum" v-model="cum.consecutivo_cum" :error-messages="errors.consecutivo_cum"  dense></v-text-field>
              </v-col>
              <!-- <v-col cols="12" sm="6" md="4">
                <v-text-field label="Cantidad Presentacion" v-model="cum.cantidad_cum" :error-messages="errors.cantidad_cum"  dense></v-text-field>
              </v-col> -->
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Descripcion Comercial" v-model="cum.descripcion_comercial" :error-messages="errors.descripcion_comercial"  dense></v-text-field>
              </v-col>
              <!-- <v-col cols="12" sm="6" md="4">
                <v-text-field type="date" label="Fecha Activo" v-model="cum.fecha_activo" :error-messages="errors.fecha_activo"  dense></v-text-field>
              </v-col> -->
              <v-col cols="12" sm="6" md="4">
                <v-autocomplete :items="['Si','No']" label="Muestra Medica" v-model="cum.muestra_medica" :error-messages="errors.muestra_medica"  dense></v-autocomplete>
              </v-col>
              <!-- <v-col cols="12" sm="6" md="4">
                <v-text-field label="Unidad" v-model="cum.unidad" :error-messages="errors.unidad"  dense></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="ATC" v-model="cum.atc" :error-messages="errors.atc"  dense></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Descripcion ATC" v-model="cum.descripcion_atc" :error-messages="errors.descripcion_atc"  dense></v-text-field>
              </v-col> -->
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Via Administración" v-model="cum.via_administracion" :error-messages="errors.via_administracion"  dense></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Concentración" v-model="cum.concentracion" :error-messages="errors.concentracion"  dense></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Principio Activo" v-model="cum.principio_activo" :error-messages="errors.principio_activo"  dense></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Unidad Medida" v-model="cum.unidad_medida" :error-messages="errors.unidad_medida"  dense></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Cantidad" v-model="cum.cantidad" :error-messages="errors.cantidad"  dense></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Unidad Referencia" v-model="cum.unidad_referencia" :error-messages="errors.unidad_referencia"  dense></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Forma Farmaceutica" v-model="cum.forma_farmaceutica" :error-messages="errors.forma_farmaceutica"  dense></v-text-field>
              </v-col>
              <!-- <v-col cols="12" sm="6" md="4">
                <v-text-field label="Nombre Rol" v-model="cum.nombre_rol" :error-messages="errors.nombre_rol"  dense></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Tipo Rol" v-model="cum.tipo_rol" :error-messages="errors.tipo_rol"  dense></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Modalidad" v-model="cum.modalidad" :error-messages="errors.modalidad" dense></v-text-field>
              </v-col> -->
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Cum Validacion" v-model="cum.cum_validacion" :error-messages="errors.cum_validacion" dense></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="error"
              dark
              @click="dialogCum = false"
            >
              Cerrar
            </v-btn>
            <v-btn
              color="boton"
              dark
              @click="guardarCum()"
            >
              Guardar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal -->
      <v-dialog v-model="dialog" max-width="1300px" persistent>
        <v-card>
          <v-alert dense text border="left" icon="mdi-medication" type="info" color="info">
            {{ isEdit ? 'Editar Medicamento' + ' - ' + editData?.cum + ' - ' + editData?.producto: 'Crear Medicamento' }}
          </v-alert>
          <v-card-text>
            <v-row class="mt-2">
              <!-- <pre>{{editData}}</pre>
              <pre>{{medicamento}}</pre> -->
              <v-col cols="12" md="12" sm="6">
                <v-autocomplete outlined :loading="loading" item-text="fullname" :items="cums"
                  :search-input.sync="campoBusquedaCum" item-value="cum_validacion"
                  no-data-text="Debe introducir 4 caracteres para buscar" v-model="medicamento.cum"
                  @change="encontrarCum($event)" label="Buscar Expediente" dense></v-autocomplete>
              </v-col>
              <v-col cols="12" md="12" sm="6">
                <v-btn color="primary" @click="abrirModalCum()" dark>
                  Crear Expediente
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <!-- <v-col cols="12" sm="6" md="4">
                <v-text-field label="Nivel ordenamiento *" v-model="medicamento.nivel_ordenamiento"  readonly dense></v-text-field>
              </v-col> -->
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Expediente *" v-model="medicamento.expediente" :error-messages="errors.expediente" readonly dense></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Producto Comercial*" v-model="medicamento.producto" readonly dense></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Titular*" v-model="medicamento.titular" readonly dense></v-text-field>
              </v-col>
            </v-row>
            <v-row>
            <v-col cols="12" sm="6" md="4">
                            <v-text-field label="Codigo Medicamento*" v-model="medicamento.codigo" dense></v-text-field>
                          </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Presentación" v-model="medicamento.descripcion_comercial" readonly dense></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Principio Activo" v-model="medicamento.principio_activo" readonly dense></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Registro Sanitario" v-model="medicamento.registro_sanitario" readonly dense></v-text-field>
              </v-col>
               <v-col cols="12" sm="12" md="4">
                  <v-text-field dense label="Fecha Vencimiento" v-model="medicamento.fecha_vencimiento" readonly>
                  </v-text-field>
                </v-col>
                  <v-col cols="12" sm="6" md="4">
                <v-text-field label="Estado Registro" v-model="medicamento.estado_registro" readonly dense></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Muestra Medica" v-model="medicamento.muestra_medica" readonly dense></v-text-field>
              </v-col>
            </v-row>
            <v-row>

              <v-col cols="12" sm="6" md="4">
                <v-autocomplete label="Clasificación Riesgo" dense v-model="medicamento.clasificacion_riesgo" :items="clasificacionesRiesgos"></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Marca Dispositivo" dense v-model="medicamento.marca_dispositivo"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="IUM Primer Nivel" dense v-model="medicamento.ium_primernivel"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field label="IUM Segundo Nivel" dense v-model="medicamento.ium_segundonivel"></v-text-field>
              </v-col>
               <v-col cols="12" sm="6" md="3">
                <v-autocomplete label="Origen" dense v-model="medicamento.origen" :items="origenes"></v-autocomplete>
              </v-col>

              <!-- <v-col cols="12" sm="6" md="4">
                <v-autocomplete label="ABC" dense v-model="medicamento.abc" :items="ABCs"></v-autocomplete>
              </v-col> -->
               <v-col cols="12" sm="4" md="3">
                  <v-text-field dense label="Resolución"
                    v-model="medicamento.resolucion" ></v-text-field>
                </v-col>
                  <v-col cols="12" sm="4" md="3">
                  <v-text-field dense label="Precio maximo"
                    v-model="medicamento.precio_maximo" ></v-text-field>
                </v-col>
                 <v-col cols="12" sm="5" md="2">
                <v-text-field prefix="$" label="Costo promedio" :value="medicamento.costo_promedio | pesoFormat" dense readonly></v-text-field>
              </v-col>
                 <v-col cols="12" sm="6" md="3">
                <v-checkbox label="Activo horus" color="red" v-model="medicamento.activo_horus" hide-details></v-checkbox>
              </v-col>
                <v-col cols="12" sm="6" md="3">
                <v-checkbox label="Refrigerado" color="red" v-model="medicamento.refrigerado" hide-details></v-checkbox>
              </v-col>
               <v-col cols="12" sm="6" md="3">
                <v-checkbox label="Generico" color="red" v-model="medicamento.generico" hide-details></v-checkbox>
              </v-col>
               <v-col cols="12" sm="6" md="3">
                <v-checkbox label="comercial" color="red" v-model="medicamento.comercial" hide-details></v-checkbox>
              </v-col>
               <v-col cols="12" sm="6" md="3">
                <v-checkbox label="Medicamento vital no disponible" color="red" v-model="editData.medicamento_vital" hide-details></v-checkbox>
              </v-col> 
              <!-- <v-col cols="12" sm="6" md="4">
                <v-autocomplete label="Estado Normativo" dense v-model="medicamento.pos" :items="estadosNormativos"></v-autocomplete>
              </v-col> -->
 
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn small color="red" dark @click="close">Cancelar
              <v-icon right>mdi-close-circle-outline</v-icon>
            </v-btn>
            <v-btn small color="success" dark @click="save">Guardar
              <v-icon right>mdi-content-save</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>

  <script>
  export default {
    props: {
      value: {
        type: Boolean,
        default: false
      },
      editData: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        dialog: this.value,
        loading: false,
        preload: false,
        campoBusquedaCum: '',
        dialogCum: false,
        cums: [],
        medicamento: {},
        cum:{
          expediente: null,
          producto: null,
          titular: null,
          registro_sanitario: null,
          fecha_expedicion: null,
          fecha_vencimiento: null,
          estado_registro: null,
          expediente_cum: null,
          consecutivo_cum: null,
          cantidad_cum: null,
          descripcion_comercial: null,
          estado_cum: null,
          fecha_activo: null,
          fecha_inactivo: null,
          muestra_medica: null,
          unidad: null,
          atc: null,
          descripcion_atc: null,
          via_administracion: null,
          concentracion: null,
          principio_activo: null,
          unidad_medida: null,
          cantidad: null,
          unidad_referencia: null,
          forma_farmaceutica: null,
          medicamento_vital:false,
          nombre_rol: null,
          tipo_rol: null,
          modalidad: null,
          cum_validacion: null,
        },
        isEdit: false,
        clasificacionesRiesgos: [
          'Tipo I',
          'Tipo IIa',
          'Tipo IIIa',
          'Tipo III',
          'Tipo IV',
          'Tipo llb'
        ],
        ABCs: ['A', 'B', 'C'],
        estadosNormativos: [
          'PBS',
          'NO PBS',
          'EXCLUSION',
        ],
        origenes: [
          'NACIONAL',
          'IMPORTADO'
        ],
        errors: {
          cum: ''
        }
      };
    },
    filters:{
      pesoFormat: (valor) => `${new Intl.NumberFormat().format(valor) || 0}`
    },
    watch: {
      value(val) {
        this.dialog = val;
      },
      dialog(val) {
        this.$emit('input', val);
        if (!val) {
          this.resetForm();
        }
      },
      editData(val) {
        this.medicamento = { ...val };
        this.isEdit = !!val.id;
      },
      campoBusquedaCum() {
        if (this.campoBusquedaCum && this.campoBusquedaCum.length >= 4) {
          this.listarCums();
        }
      }
    },
    methods: {
      close() {
        this.dialog = false;
        this.limpiarErrores();
      },
        
      save() {
        if (!this.validarCampos()) {   
          this.$toast.error('Por favor complete los campos obligatorios');
          return;
        }
        this.medicamento.codesumi_id = this.editData.codesumi_id
        this.medicamento.nivel_ordenamiento = this.editData.nivel_ordenamiento
        this.medicamento.codigo_medicamento = this.medicamento.codigo
        this.medicamento.medicamento_vital = this.editData.medicamento_vital
        this.$emit('save', this.medicamento);
        this.limpiarErrores();
        this.close();
      },
      resetForm() {
        this.medicamento = {};
        this.campoBusquedaCum = '';
        this.isEdit = false;
        this.errors = {
          cum: ''
        };
      },
      validarCampos() {
        this.errors.cum = this.medicamento.expediente ? '' : 'Este campo es obligatorio';
        return !this.errors.cum;
      },
      listarCums() {
        this.loading = true;
        this.$axios.get(`/cum/BuscarCum/${this.campoBusquedaCum}`).then((res) => {
          this.cums = res.data.original.map((cum) => ({
            cum_validacion: cum.cum_validacion,
            fullname: `${cum.cum_validacion} ${cum.producto} (${cum.titular})`,
          }));
        }).catch((error) => {
          this.$toast.error('Error al buscar Expediente');
        }).finally(() => {
          this.loading = false;
        });
      },
      encontrarCum(cum_validacion) {
        this.preload = true;
        this.$axios.get(`/cum/Cums/${cum_validacion}`).then((res) => {
            this.medicamento.expediente = res.data.expediente
          this.medicamento.producto = res.data.producto
          this.medicamento.titular = res.data.titular
          this.medicamento.descripcion_comercial = res.data.descripcion_comercial
          this.medicamento.principio_activo = res.data.principio_activo
          this.medicamento.registro_sanitario = res.data.registro_sanitario
          this.medicamento.fecha_vencimiento = res.data.fecha_vencimiento
          this.medicamento.estado_registro = res.data.estado_registro
          this.medicamento.muestra_medica = res.data.muestra_medica
        }).catch((error) => {
          console.log(error);
          this.$toast.error('Error al obtener los datos del medicamento');
        }).finally(() => {
          this.preload = false;
        });
      },

      abrirModalCum() {
        this.dialogCum = true;
      },

      limpiarErrores() {
        this.errors = {};
      },

      guardarCum() {
        this.preload = true;
        this.$axios.post('/cum/crearCum',this.cum).then((res) => {
          this.$toast.success('Se ha creado el expediente correctamente');
          this.limpiarCum();
        }).catch((error) => {
          this.$toast.error('Error al obtener los datos del medicamento');
        }).finally(() => {
          this.preload = false;
        });
      },

      limpiarCum(){
        this.cum = {
          expediente: null,
          producto: null,
          titular: null,
          registro_sanitario: null,
          fecha_expedicion: null,
          fecha_vencimiento: null,
          estado_registro: null,
          expediente_cum: null,
          consecutivo_cum: null,
          cantidad_cum: null,
          descripcion_comercial: null,
          estado_cum: null,
          fecha_activo: null,
          fecha_inactivo: null,
          muestra_medica: null,
          unidad: null,
          atc: null,
          descripcion_atc: null,
          via_administracion: null,
          concentracion: null,
          principio_activo: null,
          unidad_medida: null,
          cantidad: null,
          unidad_referencia: null,
          forma_farmaceutica: null,
          nombre_rol: null,
          tipo_rol: null,
          modalidad: null,
          cum_validacion: null,
        }
      }
    },
  };
  </script>
