<template>
  <div>
    <v-dialog v-model="preload" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Procesando Información
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-card>
      <v-card-text>
        <v-alert dense text outlined color="info" class="text-center">Filtros
        </v-alert>
        <v-row>
          <v-col cols="12" sm="12" md="12">
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Cedula" dense v-model="filtro.cedula">
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="12" v-if="modalResultados">
                <v-row dense>
                  <v-col cols="12" sm="12" md="12">
                    <v-data-table dense :headers="headers" :items-per-page="5" :items="resultados"
                      no-data-text="Sin datos para mostrar">
                      <template v-slot:[`item.estado_cargado`]="{ item }">
                        <v-chip small v-if="item.estado_cargado == '1'" text-color="white" color="success">Procesado en
                          {{item.rep}}</v-chip>
                        <v-chip small v-else-if="item.estado_cargado == '0'" text-color="white" color="info">Pendiente
                          por Procesar en {{item.rep}}</v-chip>
                        <v-chip small v-else text-color="white" color="warning">Registrado en SUMIMEDICAL</v-chip>
                      </template>
                      <template v-slot:[`item.resultado`]="{ item }">
                        <v-chip small v-if="item.estado_cargado == '1' && parseInt(item.estado_cargado) !== 2"
                          color="success" text-color="white"
                          @click="dialogoResultados=true,buscarResultadoPaciente(item)">Con Resultado</v-chip>
                        <v-chip small v-else-if="item.estado_cargado == '0' && parseInt(item.estado_cargado) !== 2"
                          text-color="white" color="error">Sin Resultado</v-chip>
                        <v-chip small v-else-if="item.estado_cargado == '0' && parseInt(item.estado_cargado) == 2"
                          text-color="white" color="warning" @click="imprimir(item.adjunto)">Descargar</v-chip>
                      </template>
                    </v-data-table>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small color="error" @click="limpiarFiltro()">
            Limpiar
          </v-btn>
          <v-btn small color="info" @click="buscarResultado()">
            Buscar
          </v-btn>
        </v-card-actions>
      </v-card-text>

      <v-dialog v-model="dialogoResultados" max-width="700px" persistent v-if="dialogoResultados">
        <v-card>
          <v-card-title class="titulo black--text">Resultados</v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-data-table dense :headers="headers" :items-per-page="5" :items="resultados" hide-default-footer
                    no-data-text="Sin datos para mostrar">
                    <template v-slot:[`item.valor_minimo`]="{ item }">
                        <v-chip small  text-color="white" color="success">{{item.valor_minimo}}</v-chip>
                      </template>
                      <template v-slot:[`item.valor_maximo`]="{ item }">
                        <v-chip small  text-color="white" color="error">{{item.valor_maximo}}</v-chip>
                      </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" small @click="dialogoResultados = false">
              Cerrar
            </v-btn>
          </v-card-actions>

        </v-card>
      </v-dialog>
    </v-card>
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('historico.atenciones.laboratorios')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonInformeCuentasMedicas',

    data() {
      return {
        preload: false,
        filtro: {
          cedula: ''
        },
        resultados: [],
        resultadosLaboratorio: [],
        modalResultados: false,
        dialogoResultados: false,
        headers: [{
            text: "Resultado",
            align: 'center',
            sortable: false,
            value: "resultado"
          },
          {
            text: "# Orden",
            align: 'center',
            value: "num_orden"
          }, {
            text: "Fecha orden",
            align: 'center',
            sortable: false,
            value: "fecha"
          }, {
            text: "Examen",
            align: 'center',
            sortable: false,
            value: "nombre_examen"
          }, {
            text: "Medico Envia Orden",
            align: 'center',
            value: "nombre_medico"
          }, {
            text: "Estado del laboratorio",
            align: 'center',
            value: "estado_cargado"
          }
        ],
        headersResultado: [{
                        text: "Fecha de resultado",
                        sortable: false,
                        value: "fecha_resultado"
                    },
                    {
                        text: "Analito",
                        value: "nombre_analito"
                    }, {
                        text: "Resultado",
                        sortable: false,
                        value: "resultado"
                    }, {
                        text: "Unidad Medida",
                        sortable: false,
                        value: "unidades"
                    }, {
                        text: "Usuario del Laboratorio",
                        value: "usuario_valida"
                    }, {
                        text: "Valor Minimo",
                        value: "valor_minimo"
                    }, {
                        text: "Valor Maximo",
                        value: "valor_maximo"
                    }
                ]
      };
    },

    mounted() {

    },


    methods: {

      limpiarFiltro() {

        this.filtro.cedula = ''
      },

      buscarResultado() {
        this.$axios.post('orden-cabecera/listarLaboratorios', this.filtro).then(res => {
          console.log('frrfrf', res);
          this.resultados = res.data
          this.modalResultados = true
        }).catch(e => {
          console.log(e);
        })

      },

      async imprimir(ruta) {
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

      buscarResultadoPaciente(item) {
        this.$axios.post('orden-cabecera/resultados', item).then(res => {
          this.resultadosLaboratorio = res.data
          this.modalResultados = true
        }).catch(e => {
          console.log(e);
        })
      }

    },
  };

</script>

<style lang="scss" scoped>

</style>
