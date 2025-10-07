<template>
  <div>
    <template>
      <v-dialog v-model="preload" persistent width="300">
        <v-card color="primary" dark>
          <v-card-text>
            Procesando Información
            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
    </template>
    <v-form ref="resultadosLaboratoriosForm" lazy-validation v-model="valid">
    <v-card elevation="0">
      <v-container fluid>
        <v-alert class="text-center" dense text border="left" type="info" icon="mdi-test-tube">
          <b>RESULTADOS DE LABORATORIOS</b></v-alert>
        <v-row dense>
          <!-- <v-col cols="12" sm="6" md="4">
            <v-autocomplete v-model="resultadosLaboratorio.laboratorio"  label="Laboratorios"
              @change="clearPresLab()"></v-autocomplete>
          </v-col> -->

          <v-col cols="12" sm="3" md="3">
            <v-autocomplete :loading="loading" label="Cup/Servicio"
              no-data-text="Escriba 4 dígitos para realizar la búsqueda" v-model="resultadosLaboratorio.laboratorio"
              :items="cups" item-text="cups" item-value="cups" :search-input.sync="FiltroCups" dense outlined :rules="campoRequerido">
            </v-autocomplete>
          </v-col>


          <v-col cols="12" sm="3" md="3">
            <v-text-field label="Resultado" v-model="resultadosLaboratorio.resultado_lab" dense outlined :rules="campoRequerido"></v-text-field>
          </v-col>
          <v-col cols="12" sm="3" md="3">
            <v-text-field type="date" v-model="resultadosLaboratorio.fecha_laboratorio" label="Fecha de Laboratorio"
              :max="hoy" dense outlined :rules="campoRequerido">
            </v-text-field>
          </v-col>

          <v-col cols="1" sm="1" md="1">
            <v-btn color="boton" class="mt-2" block small dark @click="guardarLaboratorio()">Agregar
            </v-btn>
          </v-col>
          <v-col cols="12" sm="12" md="12">
            <v-data-table :loading="loading" :items="listaLaboratorio" :headers="headerresultadosLaboratorio" dense>
                <template v-slot:[`item.user.operador`]="{ item }">
                    {{ `${item.user.operador?.nombre || ''} ${item.user.operador?.apellido || ''}`.trim() || 'Sin nombre' }}
                </template>
              <template v-slot:[`item.adjunto`]="{ item }">
                <v-tooltip top v-if="item.adjunto">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="primary" class="mr-2" v-bind="attrs" v-on="on"
                      @click="consultarAdjunto(item.adjunto)">
                      mdi-file-document
                    </v-icon>
                  </template>
                  <span>Adjunto factura</span>
                </v-tooltip>
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{on, attrs}" v-if="item.medico_registra === $store.state.auth.usuario.id">
                    <v-icon color="red" class="mr-2" v-bind="attrs" v-on="on" @click="eliminarLaboratorio(item.id)">
                      mdi-delete-circle-outline
                    </v-icon>
                  </template>
                  <span>Eliminar resultados de laboratorio</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-form>
  <div v-if="this.activarComponenteFr === true">
    <v-col cols="12" md="12" sm="12">
        <FuncionRenal :datos="datos" />
    </v-col>
  </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import FuncionRenal from "~/components/historia/formularios/FuncionRenal.vue";


  import Swal from 'sweetalert2';
  export default {
    name: "",
    components: {
    FuncionRenal
  },
    props: ['datos', 'resumen'],
    data() {
      return {
        activarComponenteFr: false,
        campoRequerido: [
                  v => !!v || 'Campo requerido',
                ],
        resultadosLaboratorio: {},
        preload: false,
        otroresultado: ['Positivo', 'Negativo'],
        factor: ['A', 'B', 'AB', 'O'],
        listaLaboratorio: [],
        loading: false,
        valid: true,
        impresion: {
          imprimir_resultados_laboratorios: '',
        },
        campoRequerido: [
          v => v !== null && v !== undefined || 'Este campo es requerido',
        ],
        cups: [],
        FiltroCups: '',
        hoy: this.$moment().format("YYYY-MM-DD"),
        headerresultadosLaboratorio: [{
            text: 'Laboratorio',
            value: 'laboratorio'
          },
          {
            text: 'Resultado',
            value: 'resultado_lab'
          },
          // {
          //   text: 'Factor Rh',
          //   value: 'resultado_lab'
          // },
          {
            text: 'Fecha lab',
            value: 'fecha_laboratorio'
          },
          {
            text: 'Regitrado por',
            value: 'user.operador'
          },
          {
            text: 'Fecha Registo',
            value: 'created_at'
          },
          {
            text: 'Acciones',
            value: 'actions'
          }
        ]
      }
    },
    watch: {
      FiltroCups(val) {
        if (val) {
          if (val.length === 4) {
            this.listaCups();
          } else if (val.length < 4) {
            this.cups = null;
          }
        } else {
          this.cups = null;

        }
      },
      'resultadosLaboratorio.resultado_lab': {
            deep: true,
            handler(newVal) {
                if (this.resultadosLaboratorio.laboratorio === '903895 - CREATININA EN SUERO U OTROS FLUIDOS') {
                  this.activarComponenteFr = true;
                    this.setCreatinina({
                        resultado_lab: newVal,
                        emitGuardarFr: false
                    });
                }
            }
        },
    },

    mounted() {
      this.listarLaboratorio()
    },

    created() {
      this.impresion = this.resumen;
    },
    methods: {
        ...mapActions('medidas', ['setCreatinina']),

      listaCups() {
        this.loading = true;
        this.$axios.post('/cup/buscarCupsNombre', {
          nombre: this.FiltroCups,
          idAfiliado: this.datos.afiliado_id,
          familia_id: [4,12]
        }).then(res => {
          this.cups = res.data
          this.loading = false;
        }).catch(e => {
          e.response
          this.loading = false;
        })
      },

      clearPresLab() {
        this.resultadosLaboratorio.resultado_lab = '',
          this.resultadosLaboratorio.factor_rh = '',
          this.resultadosLaboratorio.fecha_laboratorio = ''
      },

      listarLaboratorio() {
        let data = {}
        data.afiliado = this.datos.afiliado_id;
        if (this.ocupacional !== undefined) {
          data.afiliado = this.ocupacional[0].afiliado_id
        }
        this.loading = true;
        this.$axios.post("/resultado-laboratorio/listarResultado", {
            afiliado: data.afiliado
          })
          .then((res) => {
            this.listaLaboratorio = res.data;
          })
          .catch((err) => {
            return this.$toast.error("Error al listar antecedentes personales");
          }).finally(() => {
            this.loading = false
          })
      },

      guardarLaboratorio() {
        if(!this.$refs.resultadosLaboratoriosForm.validate()) {
          return this.$toast.error('Por favor complete todos los campos requeridos');
        }
        const data = {
          ...this.resultadosLaboratorio,
          consulta_id: this.datos.id,
          medico_registra: this.$store.state.auth.usuario.id,
        }
        this.$axios.post("/resultado-laboratorio/guardar", data)
          .then((res) => {
            this.$toast.success(res.data.mensaje);
            if(this.resultadosLaboratorio.laboratorio === '903895 - CREATININA EN SUERO U OTROS FLUIDOS'){
                this.setCreatinina({
                    resultado_lab: this.resultadosLaboratorio.resultado_lab,
                    emitGuardarFr: true
                });
            }
            this.limpiarFiltro();
            this.preload = false
            this.$refs.resultadosLaboratoriosForm.resetValidation();

          })
          .catch((err) => {
            console.log(err);
            return this.$toast.error('No hay antecedentes pre-guardados para almacenar');
          })
          .finally(() => {
          this.activarComponenteFr = false;
          });
        
      },

      limpiarFiltro() {
        for (const prop of Object.getOwnPropertyNames(
            this.resultadosLaboratorio
          )) {
          this.resultadosLaboratorio[prop] = null;
        }
        this.listarLaboratorio();

      },

      async consultarAdjunto(ruta) {
        try {
          let adj = await this.$adjuntos(ruta);
          let blob = new Blob([adj[1]], {
            type: adj[0],
          });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          window.open(link.href, "_blank");
        } catch (error) {
          console.log(error.Response);
        }
      },

      eliminarLaboratorio(id) {
        return this.$swal({
          title: '¿Estás seguro de eliminar este resultado?',
          text: "No podrás revertir esto",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.value) {
            this.$axios.delete(`/resultado-laboratorio/eliminarResultado/${id}`)
              .then((res) => {
                this.$toast.success(res.data.mensaje);
                this.listarLaboratorio();
              })
              .catch((err) => {
                console.error(err);
                this.$toast.error('Error al eliminar el resultado de laboratorio');
              });
          }
        });
      },


    }
  }

</script>
