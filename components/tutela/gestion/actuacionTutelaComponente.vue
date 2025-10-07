<template>
  <div>
    
    <!-- Asignación de proceso responsable a tutela -->
    <v-form v-if="this.creacion == false">
      <v-row>
        <!-- <pre>{{item}}</pre> -->
        <v-col cols="12" sm="6" md="3">
          <v-text-field readonly dense v-model="item.fecha_radica" label="Fecha radicado" type="date"
            :error-messages="errors.fecha_radica" >
          </v-text-field>
        </v-col>
        <!-- <v-col cols="12" sm="6" md="3">
          <v-text-field readonly v-model="item.radicado" label="Radicado tutela" dense
            :error-messages="errors.radicado">
          </v-text-field>
        </v-col> -->
        <v-col cols="12" sm="6" md="3">
          <v-text-field v-model="item.direccion" label="Dirección" :error-messages="errors.direccion" dense readonly>
          </v-text-field>
        </v-col>
        <!-- <v-col cols="12" sm="6" md="3">
          <v-autocomplete v-model="item.municipio_id" :items="municipios" item-text="nombre" item-value="id"
            label="Municipio" :error-messages="errors.municipio_id" dense>
          </v-autocomplete>
        </v-col> -->
        <v-col cols="12" sm="6" md="3">
          <v-text-field dense v-model="item.telefono" label="Teléfono" type="number" :error-messages="errors.telefono" readonly>
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-text-field dense v-model="item.celular" label="Celular" type="number" :error-messages="errors.celular" readonly>
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-text-field dense v-model="item.correo" label="Correo" type="email" :error-messages="errors.correo" readonly>
          </v-text-field>
        </v-col>
        <!-- <v-col cols="12" sm="12" md="12">
          <v-autocomplete dense v-model="item.juzgado_id" :items="juzgados" item-text="nombre" item-value="id"
            label="Juzgado" :error-messages="errors.juzgado_id">
          </v-autocomplete>
        </v-col> -->
        <v-col cols="12" sm="6" md="3">
          <v-autocomplete dense v-model="item.continuidad" :items="continuidades" label="Continuidad"
            :error-messages="errors.continuidad" readonly>
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-autocomplete dense v-model="item.exclusion" :items="exclusiones" label="Exclusión"
            :error-messages="errors.exclusion" readonly>
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-autocomplete dense v-model="item.tipo_actuacion_id" :items="tipoActuacion" item-text="nombre"
            item-value="id" label="Tipo actuación" :error-messages="errors.tipo_actuacion_id" readonly>
          </v-autocomplete>
        </v-col>
        <v-col cols="3" sm="3" md="3">
          <v-autocomplete dense v-model="item.integralidad" :items="exclusiones" label="Integralidad"
            :error-messages="errors.integralidad" readonly>
          </v-autocomplete>
        </v-col>
        
        <v-col cols="3" sm="3" md="3">
          <v-text-field dense v-model="item.dias" label="Dias de Respuesta" type="number" :error-messages="errors.dias" readonly>
          </v-text-field>
        </v-col>
        <v-col cols="3" sm="3" md="3" v-if="item.novedad_registro">
          <v-text-field dense v-model="item.novedad_registro" label="Novedad y registro" readonly>
          </v-text-field>
        </v-col>
        <v-col cols="3" sm="3" md="3" v-if="item.gestion_documental">
          <v-text-field dense v-model="item.gestion_documental" label="Gestión documental" readonly>
          </v-text-field>
        </v-col>
        <v-col cols="3" sm="3" md="3" v-if="item.medicina_laboral">
          <v-text-field dense v-model="item.medicina_laboral" label="Medicina laboral" readonly>
          </v-text-field>
        </v-col>
        <v-col cols="3" sm="3" md="3" v-if="item.reembolso">
          <v-text-field dense v-model="item.reembolso" label="Reembolso" readonly>
          </v-text-field>
        </v-col>
        <v-col cols="3" sm="3" md="3" v-if="item.transporte">
          <v-text-field dense v-model="item.transporte" label="Transporte" readonly>
          </v-text-field>
        </v-col>
        <v-col cols="3" sm="3" md="3" v-if="item.reintegro_laboral">
          <v-text-field dense v-model="item.reintegro_laboral" label="Reintegro laboral" readonly>
          </v-text-field>
        </v-col>
        <v-col cols="3" sm="3" md="3" v-if="item.hospitalizacion">
          <v-text-field dense v-model="item.hospitalizacion" label="Hospitalización" readonly>
          </v-text-field>
        </v-col>
        <v-col cols="12"  v-if="item.observacion">
          <v-text-field dense v-model="item.observacion" label="Observación" readonly>
          </v-text-field>
        </v-col>


        <v-col sm="12" md="12" lg="12" v-if="item.cup.length>0">
          <v-card class="pa-2" outlined tile>
            <b>Servicios</b>
            <h5 small v-for="(cup, index) in item.cup" :key="index">
            -  {{cup.nombre}}
            </h5>
          </v-card>
        </v-col>

        <v-col sm="12" md="12" lg="12" v-if="item.medicamentos.length>0">
          <v-card class="pa-2" outlined tile>
            <b>Medicamentos</b>
            <h5 small v-for="(medicamento, index) in item.medicamentos" :key="index">
             - {{medicamento.codesumi.codigo}}-{{medicamento.codesumi.nombre}}
            </h5>
          </v-card>
        </v-col>

         <v-col sm="12" md="12" lg="12" v-if="item.exlusion_actuacion.length>0">
          <v-card class="pa-2" outlined tile>
            <b>Exclusiones</b>
            <h5 small v-for="(exclusion, index) in item.exlusion_actuacion" :key="index">
             - {{exclusion.exclusion}}
            </h5>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="10">
          <v-autocomplete dense chips small-chips deletable-chips v-model="item.proceso" multiple item-value="id"
            :items="procesoListar" item-text="nombre" label="Proceso">
          </v-autocomplete>
        </v-col>

        <v-col sm="12" md="12" lg="12" v-if="item.adjuntos_tutelas.length>0">
          <v-btn small v-for="(adjuntoR, index) in item.adjuntos_tutelas" :key="index">
            <a @click="consultarAdjunto(adjuntoR.ruta)">
              <v-icon left color="dark">mdi-cloud-download-outline</v-icon>Adjunto
              {{ index + 1 }}
            </a>
          </v-btn>
        </v-col>

      </v-row>
      <v-card-actions v-if="item.estado_id != 17">
        <v-spacer></v-spacer>
        <v-btn  small  @click="guardarActuacion(item)" color="warning" >Asignar</v-btn>
      </v-card-actions>
    </v-form>



    <!-- creación de actuación con base en acción constitucional creada-->
    
    <v-form v-if="this.creacion == true" v-model="esValido">
      <v-alert dense text border="left" icon="mdi-text-box-search-outline" type="info">Creación de actuación para tutela
        con radicado <b>({{this.item.radicado}})</b>
      </v-alert>
      <v-row dense>
        <v-col cols="12" sm="9" md="9">
          <v-autocomplete dense v-model="actuacion.juzgado_id" :items="juzgados" item-text="nombre" readonly
            item-value="id" label="Juzgado" :error-messages="errors.juzgado_id">
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="3" md="3">
          <v-text-field v-model="actuacion.radicado" readonly label="Radicado tutela" dense
            :error-messages="errors.radicado">
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="3" md="3">
          <v-text-field dense v-model="actuacion.fecha_radica" label="Fecha radicado" type="date"
            :error-messages="errors.fecha_radica" :rules="[validaciones.requerido]">
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-text-field v-model="actuacion.direccion" label="Dirección" :error-messages="errors.direccion" dense :rules="[validaciones.requerido]">
          </v-text-field>
        </v-col>
        <!-- <v-col cols="12" sm="6" md="3">
          <v-autocomplete v-model="actuacion.municipio_id" :items="municipios" item-text="nombre" item-value="id"
            label="Municipio" :error-messages="errors.municipio_id" dense>
          </v-autocomplete>
        </v-col> -->
        <v-col cols="12" sm="6" md="3">
          <v-text-field dense v-model="actuacion.telefono" label="Teléfono" type="number"
            :error-messages="errors.telefono" :rules="[validaciones.requerido,validaciones.numero]">
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-text-field dense v-model="actuacion.celular" label="Celular" type="number"
            :error-messages="errors.celular" >
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-text-field dense v-model="actuacion.correo" label="Correo" type="email" :error-messages="errors.correo" :rules="[validaciones.requerido,validaciones.email]">
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-autocomplete dense v-model="actuacion.continuidad" :items="continuidades" label="Continuidad"
            :error-messages="errors.continuidad" :rules="[validaciones.requerido]">
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-autocomplete dense v-model="actuacion.exclusion" :items="exclusiones" label="Exclusión"
            :error-messages="errors.exclusion" :rules="[validaciones.requerido]">
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-autocomplete dense v-model="actuacion.integralidad" :items="exclusiones" label="Integralidad"
            :error-messages="errors.integralidad" :rules="[validaciones.requerido]">
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-autocomplete dense v-model="actuacion.tipo_actuacion_id" :items="tipoActuacion" item-text="nombre"
            item-value="id" label="Tipo actuación" :error-messages="errors.tipo_actuacion_id" :rules="[validaciones.requerido]">
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-text-field dense v-model="actuacion.dias" label="Dias de Respuesta" type="number"
            :error-messages="errors.dias" :rules="[validaciones.requerido, validaciones.numero]">
          </v-text-field>
        </v-col>

        <v-col cols="12" sm="12" md="12">
          <v-autocomplete deletable-chips small-chips dense v-model="tipo_servicio" :items="itemsTipoServicio" chips
            label="Tipo de servicio" multiple :rules="[validaciones.requerido]">
          </v-autocomplete>
        </v-col>


        <v-col cols="12" sm="12" md="12" v-show="ActivarCampos('OTROS')">
          <v-combobox small-chips deletable-chips dense v-model="actuacion.otro_tiposervicio" chips
            label="Otros servicios" multiple>
            <template v-slot:selection="{ attrs, item }">
              <v-chip small v-bind="attrs" close @input="remover(item)">
                {{ item }}&nbsp;
              </v-chip>
            </template>
          </v-combobox>
        </v-col>

        <v-col cols="12" sm="12" md="12" v-if="ActivarCampos('NOVEDADES Y REGISTRO')">
          <v-autocomplete :items="['AFILIACION', 'DESAFILIACION']" label="Novedades y registros" dense required
            v-model="actuacion.novedad_registro" :error-messages="errors.novedad_registro"></v-autocomplete>
        </v-col>

        <v-col cols="12" sm="12" md="12" v-show="ActivarCampos('EXCLUSION')">
          <v-autocomplete :items="exclusion" label="Exclusión" dense v-model="actuacion.exclusiones"
            :error-messages="errors.exclusiones" chips multiple>
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="12" md="12" v-show="ActivarCampos('GESTION DOCUMENTAL')">
          <v-autocomplete :items="gestionDocumental" dense label="Gestión documental" required
            v-model="actuacion.gestion_documental" :error-messages="errors.gestion_documental"></v-autocomplete>
        </v-col>

        <v-col cols="12" sm="12" md="12" v-show="ActivarCampos('SERVICIOS')">
          <v-autocomplete dense :items="allCups" item-text="nombre" item-value="id" label="Servicios"
            :search-input.sync="cup" v-model="cups" chips multiple>
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="12" md="12" v-show="ActivarCampos('MEDICAMENTOS')">
          <v-autocomplete :search-input.sync="FiltroCodesumis" :items="allMedicamentos" item-text="codesumi.nombre"
            item-value="id" label="Medicamentos" v-model="medicamentos" dense chips multiple deletable-chips
            no-data-text="Debe ingresar el nombre del insumo o medicamento">
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="12" md="12" v-show="ActivarCampos('MEDICINA LABORAL')">
          <v-autocomplete dense v-model="actuacion.medicina_laboral"
            :items="['CALIFICACION PERDIDA CAPACIDAD', 'INCAPACIDAD MAXIMA', 'OTRO']" label="Medicina laboral"
            :error-messages="errors.medicina_laboral">
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="12" md="12" v-show="ActivarCampos('MEDICINA LABORAL') && OtroMedicinalaboral('OTRO')">
          <v-text-field dense v-model="actuacion.medicina_laboral" label="OTRO MEDICINA LABORAL" required>
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="12" v-show="ActivarCampos('HOSPITALIZACION')">
          <v-text-field dense v-model="actuacion.hospitalizacion" label="Hospitalización">
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="12" v-show="ActivarCampos('REINTEGRO LABORAL')">
          <v-text-field dense v-model="actuacion.reintegro_laboral" label="Reintegro laboral" required>
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="12" v-show="ActivarCampos('REEMBOLSO')">
          <v-autocomplete dense v-model="actuacion.reembolso"
            :items="['TRANSPORTE', 'SERVICIOS', 'MEDICAMENTOS', 'OTRO']" label="REEMBOLSO" required>
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="12" md="12" v-show="ActivarCampos('REEMBOLSO') && OtroReembolso('OTRO')">
          <v-text-field dense v-model="actuacion.reembolso" label="OTRO REEMBOLSO" required></v-text-field>
        </v-col>

        <v-col cols="12" sm="12" md="12" v-show="ActivarCampos('TRANSPORTE')">
          <v-autocomplete dense v-model="actuacion.transporte"
            :items="['TRANSPORTE INTER URBANO', 'TRANSPORTE AEREO', 'TRANSPORTE FLUVIAL', 'TRANSPORTE TERRESTRE', 'OTRO']"
            label="TRANSPORTE" required></v-autocomplete>
        </v-col>

        <v-col cols="12" sm="12" md="12" v-show="ActivarCampos('TRANSPORTE') && OtroTransporte('OTRO')">
          <v-text-field dense v-model="actuacion.transporte" label="OTRO TRANSPORTE" required></v-text-field>
        </v-col>
        


        <v-col cols="12" sm="6" md="10">
          <v-autocomplete dense chips small-chips deletable-chips v-model="actuacion.proceso_id" multiple
            :items="procesoListar" item-text="nombre" item-value="id" label="Proceso" :rules="[validaciones.requerido]">
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="12" md="12">
          <v-textarea auto-grow dense v-model="actuacion.observacion" label="Observacion"
            :error-messages="errors.observacion">
          </v-textarea>
        </v-col>
        <v-col cols="12" sm="6" md="6">
          <v-file-input counter show-size truncate-length="10" v-model="adjuntos" small-chips multiple outlined dense
            label="Adjuntar" accept=".jpg, .jpeg, .pdf">
          </v-file-input>
          <v-alert border="left" colored-border type="error" dense>
            <small>Los archivos deben tener un tamaño máximo de 1GB<p> Extensiones
                permitidas:<b><i>jpg,
                    jpeg, pdf</i></b></p></small>
          </v-alert>
        </v-col>
      </v-row>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn small @click="guardarActuacion()" color="success">Guardar</v-btn>
      </v-card-actions>
    </v-form>
  </div>
</template>
<script>
import { mapActions } from 'vuex';

  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
    name: 'actuacionTutelaComponente',
    props: {
      item: {
        type: Object,
        default: {}
      },
      creacion: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        adjuntos: [],
        preload: false,
        municipios: [],
        continuidades: ['NUEVO', 'CONTINUIDAD'],
        exclusiones: ['SI', 'NO'],
        juzgados: [],
        tipoActuacion: [],
        procesoListar: [],
        tutelas: {
          fecha_radica: '',
          radicado: '',
          direccion: '',
          municipio_id: '',
          telefono: '',
          celular: '',
          correo: '',
          juzgado_id: '',
          continuidad: '',
          exclusion: '',
          integralidad: '',
          tipo_actuacion_id: '',
          dias: '',
        },
        tipo_servicio: [],
        reembolso:[],
        transporte: [],
        medicinaLaboral: [],
        novedadesregistro : null,
        gestiondocumental : null,
        actuacion: {
          fecha_radica: null,
          radicado: this.item.radicado,
          direccion: null,
          municipio_id: null,
          telefono: null,
          celular: null,
          correo: null,
          juzgado_id: this.item.juzgado,
          continuidad: null,
          exclusion: null,
          exclusiones:[],
          integralidad: null,
          tipo_actuacion_id: null,
          dias: null,
          proceso_id: [],
          observacion: null,
          medicina_laboral: null,
          novedad_registro:null,
          tutela_id: null,
          gestion_documental:null,
          transporte:null,
          reembolso: null,
          reintegro_laboral:null,
          hospitalizacion:null
        },
        errors: {
          fecha_radica: null,
          radicado: null,
          direccion: null,
          municipio_id: null,
          telefono: null,
          celular: null,
          juzgado_id: null,
          continuidad: null,
          exclusion: null,
          integralidad: null,
          tipo_actuacion_id: null,
          dias: null,
          correo:null
        },
        asignar: {
          actuacion_tutelas_id: '',
          proceso_tutela_id: [],
        },
        exclusion: ['TRATAMIENTO INFERTILIDAD', 'TRATAMIENTO ESTETICO', 'TRATAMIENTO EXPERIMENTAL',
          'TRATAMIENTO MEDICO-QUIRURGICO REALIZADO EN EL EXTERIOR',
          'MEDICAMENTO NO AUTORIZADO POR INVIMA', 'TECNOLOGIA SIN EVIDENCIA CIENTIFICA', 'ORTODONCIA',
          'IMPLANTOLOGIA DENTAL',
          'DISPOSITIVO PROTESICO CAVIDAD ORAL', 'BLANQUEAMIENTO DENTAL',
          'INSTITUCIONES NO HABILITADAS EN SISTEMA DE SALUD',
          'ARTICULO SUNTUARIO', 'COSMETICOS', 'VITAMINAS', 'LIQUIDOS PARA LENTES DE CONTACTO',
          'TRATAMIENTO CAPILAR', 'SHAMPOO',
          'JABON', 'ENJUAGUE BUCAL', 'CREMA DENTAL', 'CEPILLO', 'SEDA DENTAL', 'ELEMENTOS DE ASEO', 'LECHES',
          'CREMA HIDRATANTE',
          'ANTISOLAR', 'DROGAS PARA LA MEMORIA', 'EDULCORANTES O SUSTITUTOS DE LA SAL', 'ANOREXIGENOS',
          'SERVICIOS FUERA DEL AMBITO DE SALUD',
          'CALZADO ORTOPEDICO', 'PAÑALES', 'TOALLAS HIGIENICAS'
        ],
        gestionDocumental: ['DERECHO DE PETICION NO CONTESTADO', 'SOLICITUD HISTORIA CLINICA'],
        allCups: [],
        cups: [],
        cup: null,
        allMedicamentos: [],
        medicamentos: [],
        FiltroCodesumis: null,
        validaciones:{
        email: v => /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'El correo debe ser válido',
        requerido: v=> !!v || 'Este campo no puede estar vacío',
        numero: v => /^\d+$/.test(v) || 'Este campo solo puede contener numeros',


      },
      esValido : false
      };
    },

    mounted() {
      this.listarMunicipio()
      this.listarjuzgados()
      this.listarTipoActuacion()
      this.listarProcesos()
    },

    watch: {
      cup(val) {
        if (val) {
          if (val.length > 4) {
            this.getCups();
          }
        }
      },
      FiltroCodesumis(val) {
        if (val) {
          if (val.length === 4) {
            this.listarCodesumis();
          } else if (val.length < 4) {
            this.allMedicamentos = null;
          }
        } else {
          this.allMedicamentos = null;
        }
      }
    },

    computed: {
      itemsTipoServicio() {
        let items = ['NOVEDADES Y REGISTRO', 'EXCLUSION', 'GESTION DOCUMENTAL', 'HOSPITALIZACION', 'SERVICIOS',
          'MEDICAMENTOS', 'MEDICINA LABORAL', 'REEMBOLSO', 'REINTEGRO LABORAL', 'TRANSPORTE', 'OTROS'
        ];

        if (this.tipo_servicio == []) return items

        return items
      },
    },

    methods: {
      ...mapActions('app',['setPreload']),
      listarMunicipio() {
        this.$axios.get('/municipios/listar').then(res => {
          this.municipios = res.data
        }).catch(error => {
          console.log(error)
        })
      },

      listarjuzgados() {
        this.$axios.post('juzgado/listar').then(res => {
          this.juzgados = res.data
        }).catch(error => {
          console.log(error)
        })
      },

      listarTipoActuacion() {
        this.loading = true
        this.$axios.get('tipo-actuacion').then(res => {
          this.tipoActuacion = res.data
          this.loading = false
        }).catch(error => {
          this.loading = false
        })
      },

      listarProcesos() {
        this.loading = true
        this.$axios.get('proceso-tutela/listar').then(res => {
          this.procesoListar = res.data.data
          this.loading = false
        }).catch(error => {
          this.ErrorEntrada(error.response.data)
          this.loading = false
        })
      },

      guardarActuacion(item) {
        // console.log('item', item);
        if (this.creacion == false) {
          this.asignar.actuacion_tutelas_id = this.item.id
          this.asignar.proceso_tutela_id = this.item.proceso
          if(this.asignar.proceso_tutela_id.length == 0){
            return this.$swal({
                    title: "¡No puede ser!",
                    text: "Debes relacionar al menos un proceso para asignar una acción",
                    type: "error",
                });
          }
          this.setPreload(true)
          this.$axios.post('actuacion-tutela/asignar', this.asignar).then(res => {
            
            this.asignar = {}
            this.$toast.success(res.data.mensaje);
            this.$emit('respuestaComponente');

          }).catch((error) => {
            // console.log(error.response.data.error)
            this.$toast.error(error.response.data.error)
            
          }).finally(()=>{
            this.setPreload(false)
          })
        } else if (this.creacion == true) {
          if(this.esValido == false){
            this.$toast.error('Debe diligenciar todos los campos obligatorios')
          }
          this.setPreload(true)
          const formData = new FormData();
          formData.append(`observacion`, this.actuacion.observacion !=  null ? this.actuacion.observacion : '');
          formData.append(`transporte`, this.actuacion.transporte != null ? this.actuacion.transporte : '');
          formData.append(`reembolso`, this.actuacion.reembolso  != null? this.actuacion.reembolso : '');
          formData.append(`reintegro_laboral`, this.actuacion.reintegro_laboral != null ? this.actuacion.reintegro_laboral : '');
          formData.append(`hospitalizacion`, this.actuacion.hospitalizacion != null ? this.actuacion.hospitalizacion : '');
          formData.append(`medicina_laboral`, this.actuacion.medicina_laboral != null ? this.actuacion.medicina_laboral : '');
          formData.append(`gestion_documental`, this.actuacion.gestion_documental != null ? this.actuacion.gestion_documental : '');
          formData.append(`exclusion`, this.actuacion.exclusion != null ? this.actuacion.exclusion : '');
          formData.append(`novedad_registro`, this.actuacion.novedad_registro != null ? this.actuacion.novedad_registro :  '');
          formData.append(`dias`, this.actuacion.dias != null ? this.actuacion.dias : '');
          formData.append(`tipo_actuacion_id`, this.actuacion.tipo_actuacion_id != null ? this.actuacion.tipo_actuacion_id : '');
          formData.append(`integralidad`, this.actuacion.integralidad != null ? this.actuacion.integralidad : '');
          formData.append(`continuidad`, this.actuacion.continuidad != null ? this.actuacion.continuidad : '');
          formData.append(`correo`, this.actuacion.correo != null ? this.actuacion.correo : '' );
          formData.append(`celular`, this.actuacion.celular != null ? this.actuacion.celular : '');
          formData.append(`telefono`, this.actuacion.telefono != null ? this.actuacion.telefono : '');
          formData.append(`direccion`, this.actuacion.direccion != null ? this.actuacion.direccion : '' );
          formData.append(`fecha_radica`, this.actuacion.fecha_radica != null ? this.actuacion.fecha_radica : '');
          formData.append(`tutela_id`, this.item.id);

          
          if (this.actuacion.exclusiones.length > 0) {
            for (let i = 0; i < this.actuacion.exclusiones.length; i++) {
              formData.append(`exclusiones[]`, this.actuacion.exclusiones[i]);
            }
          }
          if(this.actuacion.proceso_id.length > 0){
            for(let i = 0; i < this.actuacion.proceso_id.length; i++){
              formData.append(`proceso_id[]`,this.actuacion.proceso_id[i])
            }
          }
          if (this.medicamentos.length > 0) {
            for (let i = 0; i < this.medicamentos.length; i++) {
              formData.append(`medicamentos[]`, this.medicamentos[i]);
            }
          }
          if (this.cups.length > 0) {
            for (let i = 0; i < this.cups.length; i++) {
              formData.append(`cups[]`, this.cups[i]);
            }
          }
          for (let i = 0; i < this.adjuntos.length; i++) {
            formData.append(`adjuntos[]`, this.adjuntos[i]);
          }
          // for(const datos of formData.entries()){
          //   console.log(datos[0],' ',datos[1])
          // }
          this.$axios.post('actuacion-tutela/crear', formData).then(res => {
            
            this.actuacion = {}
            this.$emit('respuestaComponente');
            this.setPreload(false)
            this.$toast.success(res.data.mensaje)
          }).catch(error => {
            if(error.response.data.mensaje){
              this.$toast.error(error.response.data.mensaje)
            }else if(error.response.data){
              this.ErrorEntrada(error.response.data)
            }
            
          })
        }
      },

      ErrorEntrada(errors) {
        for (const key in this.errors) {
          if (key in errors) {
            this.errors[key] = errors[key].join(',')
          }
        }
      },

      limpiarError() {
        for (const key in this.errors) {
          this.errors[key] = ''
        }
      },

      ActivarCampos(msg) {
        let found = this.tipo_servicio.find(tipo => tipo == msg);
        if (found) return true;
        return false;
      },

      OtroMedicinalaboral(msg) {
        return this.medicinaLaboral == msg || false;
      },

      OtroReembolso(msg) {
        return this.reembolso == msg || false;
      },

      OtroTransporte(msg) {
        return this.transporte == msg || false;
      },

      remover(item) {
        this.actuacion.otro_tiposervicio.splice(this.actuacion.otro_tiposervicio.indexOf(item), 1)
        this.actuacion.otro_tiposervicio = [...this.actuacion.otro_tiposervicio]
      },

      getCups() {
        this.preload = true;
        this.$axios.post("/cup/listar?page=0", {
            cups: this.cup
          })
          .then((res) => {
            this.preload = false;
            if (res.data.data.length >= 2) {
              this.allCups = res.data.data.map((cup) => {
                return {
                  id: cup.id,
                  nombre: cup.CodigoNombre,
                }
              })
            } else if (res.data.data.length == 1) {
              this.allCups = res.data.data.map((cup) => {
                return {
                  id: cup.id,
                  nombre: cup.CodigoNombre,
                }
              })
            }
          }).catch(e => {
            this.preload = false;
            console.log(e);
          })
      },

      listarCodesumis() {
        this.preload = true;
        this.$axios.post('/medicamentos/listarVademecum', {
          nombre: this.FiltroCodesumis
        }).then(res => {
          this.allMedicamentos = res.data;
          this.preload = false;
        }).catch(e => {
          console.error(e.response);
          this.preload = false;
        });
      },

      async consultarAdjunto(ruta) {
        try {
          this.setPreload(true)
          let adj = await this.$adjuntos(ruta);
          let blob = new Blob([adj[1]], {
            type: adj[0],
          });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          window.open(link.href, "_blank");
          this.setPreload(false)
        } catch (error) {
          console.log(error);
        }
      },

    },
  }

</script>
