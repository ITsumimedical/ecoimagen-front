<template>
  <div>
    <v-card>

      <v-col cols="12" sm="12" md="12">
        <v-alert class="text-center" dense text outlined type="info" icon="mdi-book-open-page-variant">
          <b>Historico alertas</b></v-alert>
        <v-row>
          <v-col cols="12" sm="12" md="12">
            <v-expansion-panels focusable>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <h3>Medicamentos Alergicos</h3>
                </v-expansion-panel-header>
                <v-expansion-panel-content >
                  <v-col cols="12" sm="12" md="12">
                    <v-row dense>
                      <v-col cols="12" sm="12" md="12">
                        <v-data-table :items="alergiaMedicamento" :headers="medicamentos" dense>
                        </v-data-table>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <h3>Alergias Alimentarias</h3>
                </v-expansion-panel-header>
                <v-expansion-panel-content>

                  <v-col cols="12" sm="12" md="12">
                    <v-row dense>
                      <v-col cols="12" sm="12" md="12">
                        <v-data-table :items="alergiaAmbiental" :headers="ambientales" dense>
                        </v-data-table>
                      </v-col>

                    </v-row>
                  </v-col>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <h3>Alergicas Ambientales</h3>
                </v-expansion-panel-header>
                <v-expansion-panel-content >
                  <v-col cols="12" sm="12" md="12">
                    <v-row dense>
                      <v-col cols="12" sm="12" md="12">
                        <v-data-table :items="alergiaAlimento" :headers="alimnetos" dense>
                        </v-data-table>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <h3>Otras Alergias</h3>
                </v-expansion-panel-header>
                <v-expansion-panel-content >
                   <v-col cols="12" sm="12" md="12">
                    <v-row dense>
                      <v-col cols="12" sm="12" md="12">
                        <v-data-table :items="otrasAlergias" :headers="otras" dense>
                    </v-data-table>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-expansion-panel-content>
              </v-expansion-panel>


            </v-expansion-panels>
          </v-col>
        </v-row>
      </v-col>
       <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red" small dark @click="$emit('respuestaComponente')">Cerrar</v-btn>
    </v-card-actions>
    </v-card>
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
  </div>
</template>

<script>
  export default {
    name: 'WorkspaceJsonHistoricoAlertasComponent',
    props: {
      datosCita: Object
    },
    data() {
      return {
        preload:false,
        alergiaMedicamento: [],
        alergiaAlimento: [],
        alergiaAmbiental: [],
        otrasAlergias: [],
        medicamentos: [{
            text: 'Fecha',
            value: 'created_at'
          },
          {
            text: 'Medicamneto',
            value: 'medicamento'
          },
          {
            text: 'Observación',
            value: 'observacion_medicamento'
          },
          {
            text: 'Medico',
            value: 'operador'
          }
        ],
        alimnetos: [{
            text: 'Fecha',
            value: 'created_at'
          },
          {
            text: 'Alimento',
            value: 'alimento'
          },
          {
            text: 'Observación',
            value: 'observacion_alimento'
          },
          {
            text: 'Medico',
            value: 'operador'
          }
        ],
        ambientales: [{
            text: 'Fecha',
            value: 'created_at'
          },
          {
            text: 'Ambiental',
            value: 'ambiental'
          },
          {
            text: 'Observación',
            value: 'observacion_ambiental'
          },
          {
            text: 'Medico',
            value: 'operador'
          }
        ],
        otras: [{
            text: 'Fecha',
            value: 'created_at'

          },
          {
            text: 'Otras alergias',
            value: 'otras'
          },
          {
            text: 'Observación',
            value: 'observacion_otro'
          },
          {
            text: 'Medico',
            value: 'operador'
          }
        ]
      };
    },

    mounted() {
      this.listarAlergiasMedicamento();
      this.listarAlergiasAmbientales()
      this.listarAlergiasAlimentos()
      this.listarOtras()
    },

    methods: {
      validarErrores() {
              return [];
            },
      listarAlergiasMedicamento() {
        // this.preload = true
        let data = {}
        data.afiliado = this.datosCita.afiliado_id;
        this.$axios.post("/antecedentes-alergicos/listarAlergiaMedicamentos", {
            afiliado: data.afiliado
          })
          .then((res) => {
            this.alergiaMedicamento = res.data;
            this.preload = false
          })
          .catch((err) => {
            return this.$toast.error("Error al listar antecedentes personales");
            this.preload = false
          });
      },
      listarAlergiasAmbientales() {
        let data = {}
        data.afiliado = this.datosCita.afiliado_id;
        this.$axios.post("/antecedentes-alergicos/listarAlergiaAmbiental", {
            afiliado: data.afiliado
          })
          .then((res) => {
            this.alergiaAmbiental = res.data;
          })
          .catch((err) => {
            return this.$toast.error("Error al listar antecedentes personales");
          });
      },
      listarAlergiasAlimentos() {
        let data = {}
        data.afiliado = this.datosCita.afiliado_id;
        this.$axios.post("/antecedentes-alergicos/listarAlergiaAlimentos", {
            afiliado: data.afiliado
          })
          .then((res) => {
            this.alergiaAlimento = res.data;
          })
          .catch((err) => {
            return this.$toast.error("Error al listar antecedentes personales");
          });

      },

      listarOtras() {
        // this.preload = true
        let data = {}
        data.afiliado = this.datosCita.afiliado_id;
        this.$axios.post("/antecedentes-alergicos/listarOtras", {
            afiliado: data.afiliado
          })
          .then((res) => {
            this.otrasAlergias = res.data;
            this.preload = false
          })
          .catch((err) => {
            return this.$toast.error("Error al listar antecedentes personales");
            this.preload = false
          });
      },
    },
  };

</script>
