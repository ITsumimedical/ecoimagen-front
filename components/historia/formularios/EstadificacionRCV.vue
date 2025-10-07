<template>
  <div>
    <v-col cols="12" sm="12" md="12">
      <v-alert color="info" border="left" dense text icon="mdi-information" class="text-center"><b>TEST DE
          FRAMINGHAM</b></v-alert>
    </v-col>
    <v-card-text>
      <v-form lazy-validation ref="form" v-model="valid">
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-alert color="warning" text dense border="left" class="text-center"><b>Factores de riesgo requeridos</b>
            </v-alert>
            <v-row>
              <v-col cols="12" sm="3" md="3">
                <v-text-field label="Edad" outlined dense type="number"
                  v-model="this.datos.afiliado.edad_cumplida" readonly></v-text-field>
              </v-col>
              <v-col cols="12" sm="3" md="3">
                <v-text-field label="Sexo" outlined dense v-model="this.datos.afiliado.sexo" readonly></v-text-field>
              </v-col>
              <v-col cols="12" sm="3" md="3">
                <v-text-field label="Diabetes" outlined dense v-model="diabetes" readonly :rules="[v => (this.datos.cita.tipo_historia_id == 12 || this.datos.cita.tipo_historia_id == 13) ? (v !== null && v !== undefined && v !== '' || 'Este campo es requerido') : true]">
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="3" md="3">
                <v-text-field label="Fuma" outlined dense v-model="fuma" readonly :rules="[v => (this.datos.cita.tipo_historia_id == 12 || this.datos.cita.tipo_historia_id == 13) ? (v !== null && v !== undefined && v !== '' || 'Este campo es requerido') : true]">
                </v-text-field>
              </v-col>
            </v-row>
          </v-col>
          <v-divider inset vertical></v-divider>
          <v-col>
            <v-alert color="warning" text dense border="left" class="text-center"><b>Presión/Tensión arterial (solo en
                mm de Hg)</b>
            </v-alert>
            <v-row justify="center" align="center">
              <v-col cols="12" sm="8" md="8" class="d-flex justify-center">
                <v-text-field label="Sistólica" dense outlined v-model="framingham.presion_sistolica"
                  :rules="[v => (this.datos.cita.tipo_historia_id == 12 || this.datos.cita.tipo_historia_id == 13) ? (v !== null && v !== undefined && v !== '' || 'Este campo es requerido') : true]" readonly>
                </v-text-field>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12" sm="12" md="12">
            <v-alert text dense color="warning" border="left" class="text-center"><b>Perfil de lípidos (solo en
                mg/dl)</b></v-alert>
            <v-row justify="center" align="center">
              <v-col cols="12" md="3" sm="3">
                <v-text-field label="Colesterol total" v-model="colesterol_total" type="number" dense outlined
                  :rules="[v => (this.datos.cita.tipo_historia_id == 12 || this.datos.cita.tipo_historia_id == 13) ? (v !== null && v !== undefined && v !== '' || 'Este campo es requerido') : true]">
                </v-text-field>
              </v-col>
              <v-col cols="12" md="3" sm="3">
                <v-text-field label="Colesterol HDL" dense outlined type="number" v-model="colesterol_hdl"
                  :rules="[v => (this.datos.cita.tipo_historia_id == 12 || this.datos.cita.tipo_historia_id == 13) ? (v !== null && v !== undefined && v !== '' || 'Este campo es requerido') : true]">
                </v-text-field>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-form>

      <!-- Dialogo para mostrar el resultado -->
      <v-dialog v-model="dialog" max-width="500px" persistent>
        <v-card>
          <v-card-title class="headline">Resultado del Test de Framingham</v-card-title>
          <v-card-text>
            <p>Tu riesgo cardiovascular es <strong>{{ riesgo }}</strong>, con una probabilidad del
              <strong>{{ porcentajeRiesgo }}%</strong> de sufrir una enfermedad cardíaca en los próximos 10 años.</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" small @click="cerrarDialog">Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-alert v-if="mensajeExito" color="success" text dense>{{ mensajeExito }}</v-alert>

      <v-alert v-if="!mensajeExito" color="red" text dense class="text-center" ><strong>{{ 'Faltan datos para realizar el calculo.' }}</strong></v-alert>
    </v-card-text>
  </div>
</template>

<script>
  import {
    mapActions,
    mapGetters
  } from 'vuex';

  export default {
    props: ['datos'],
    data() {
      return {
        valorColesterol: null,
        fuma: 'No',
        diabetes: '',
        colesterol_hdl: '',
        colesterol_total: '',
        dialog: false,
        riesgo: '',
        porcentajeRiesgo: '',
        mensajeExito: '',
        valid: false,
        guardarLoading: false,
        timeoutFramingham: null,
        rules: {
          hdl: [
            v => !!v || 'Este campo es requerido',
            v => (v > 0 && v < 100) || 'El valor debe estar entre 1 y 99',
          ],
          total: [
            v => !!v || 'Este campo es requerido',
            v => (v > 0 && v < 401) || 'El valor debe estar entre 1 y 400',
          ],
          sistolica: [
            v => !!v || 'Este campo es requerido',
            v => (v >= 50 && v <= 250) || 'El valor debe estar entre 50 y 250',
          ],
          diabetico: [
            v => v !== null && v !== undefined && v !== '' || 'Este campo es requerido' || []
          ],
          fumador: [
            v => v !== null && v !== undefined && v !== '' || 'Este campo es requerido' || []
          ]
        }
      }
    },
    mounted() {
      this.obtenerDatosDiabetes();
      this.obtenerColesterol();
    },
    watch: {
            camposCompletos(val) {
                clearTimeout(this.timeoutFramingham);

                if (val) {
                    this.timeoutFramingham = setTimeout(() => {
                        if (this.validarErrores()) {
                            this.calcularFramingham();
                        }
                    }, 3000);
                }
            },
             estiloVida(nuevo) {
              if (nuevo === "Fumador pasivo" || nuevo === "Fumador activo") {
                this.fuma = "Si";
              } else {
                this.fuma = "No";
              }
            }
        },
    computed: {
        ...mapGetters('medidas', ['framingham', 'estiloVida']),
     
        camposCompletos() {
            return (
            this.datos.afiliado.edad_cumplida &&
            this.datos.afiliado.sexo &&
            this.fuma !== '' &&
            this.diabetes !== '' &&
            this.framingham.presion_sistolica &&
            this.colesterol_total &&
            this.colesterol_hdl
            );
        },
    },

    methods: {
      ...mapActions('medidas', ['updateExamenF','setEstiloVida']),

      obtenerDatos() {
            const data =  {
                edad_puntaje: this.datos.afiliado.edad_cumplida,
                colesterol_total: this.colesterol_total,
                colesterol_hdl: this.colesterol_hdl,
                usuario_id: this.$store.state.auth.usuario.id,
                afiliado_id: this.datos.afiliado_id,
                estado_id: 1,
                resultado: this.mensajeExito
            }
            return { datos: data };
        },
      calcularFramingham() {
        const edad = this.datos.afiliado.edad_cumplida || 0;
        const sexo = this.datos.afiliado.sexo || '';
        const fuma = this.fuma === 'Si';
        const diabetes = this.diabetes === 'Si';
        const presionSistolica = parseFloat(this.framingham.presion_sistolica) || 0;
        const colesterolTotal = parseFloat(this.colesterol_total) || 0;
        const colesterolHDL = parseFloat(this.colesterol_hdl) || 0;

        let puntaje = 0;
        // Cálculo del puntaje
        puntaje += Math.floor((edad - 30) / 5);
        if (sexo === 'F') {
          puntaje -= 2;
        }
        if (fuma) {
          puntaje += 3;
        }
        if (diabetes) {
          puntaje += 4;
        }
        if (presionSistolica >= 120) {
          if (presionSistolica < 140) {
            puntaje += 2;
          } else if (presionSistolica < 160) {
            puntaje += 3;
          } else {
            puntaje += 4;
          }
        }
        if (colesterolTotal >= 200) {
          puntaje += Math.floor((colesterolTotal - 200) / 25) + 1;
        }
        if (colesterolHDL < 40) {
          puntaje += 2;
        } else if (colesterolHDL >= 60) {
          puntaje -= 1;
        }

        // Calcular porcentaje de riesgo
        this.porcentajeRiesgo = Math.min(puntaje, 100);
        this.riesgo = this.porcentajeRiesgo > 20 ? 'Alto' : 'Bajo';

        // Mostrar resultado en el diálogo
        this.dialog = true;
      },

      validarErrores() {
        // Validar los campos en los tipos de historia requeridos
        return this.$refs.form.validate();
      },

      cerrarDialog() {
        this.mensajeExito =
          `Tu riesgo cardiovascular es ${this.riesgo}, con una probabilidad del ${this.porcentajeRiesgo}% de sufrir una enfermedad cardíaca en los próximos 10 años.`;
        this.dialog = false; // Cerrar el diálogo
      },

      obtenerDatosDiabetes() {
        let afiliado_id = this.datos.afiliado.id;
        this.$axios.get(`/antecedentes-personales/obtenerDiabetes/${afiliado_id}`)
          .then((res) => {
            this.diabetes = res.data ? "Si" : "No";
          })
          .catch((err) => {
            return this.$toast.error("Error al generar información de diabetes");
          })
      },
      obtenerColesterol() {
        let afiliadoId = this.datos.afiliado_id;
        this.$axios.post("/resultado-laboratorio/listarResultadoRc", {
            afiliado: afiliadoId,
            usoFraminghan: true
        })
        .then((res) => {
            this.valorColesterol = res.data;

            let colesterolHDL = res.data.find(item => item.laboratorio.includes("COLESTEROL DE ALTA DENSIDAD"))?.resultado1 || null;
            let colesterolTotal = res.data.find(item => item.laboratorio.includes("COLESTEROL TOTAL"))?.resultado1 || null;

            this.colesterol_hdl = colesterolHDL;
            this.colesterol_total = colesterolTotal;
        })
        .catch((err) => {
            this.$toast.error("Error al consultar el colesterol");
        })
        .finally(() => {
            this.loading = false;
        });
    },

    }
  }

</script>

