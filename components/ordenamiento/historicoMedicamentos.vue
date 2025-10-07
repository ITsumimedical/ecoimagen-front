<template>
  <div>
    <v-row dense>
      <v-col cols="12" sm="12" md="12">
        <v-expansion-panels focusable>
          <v-expansion-panel>
            <v-expansion-panel-header class="py-2">
                <div class="d-flex align-center">
                <v-icon color="deep-purple accent-4" size="20" class="mr-2">mdi-pill</v-icon>

                <v-divider vertical class="mx-2" style="height: 24px;"></v-divider>

                <h3 class="text-subtitle-2 font-weight-medium mb-0">Histórico de Medicamentos</h3>
                </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-data-table :headers="headersHistoricoMedicamentos"
                            :items="historicoOrdenes"
                            item-key="id"
                            sort-by="id"
                            group-by="orden"
                            :search="buscar"
                            show-group-by>
                <template v-slot:top>
                  <v-spacer></v-spacer>
                  <v-text-field label="Buscar ..." v-model="buscar"></v-text-field>
                </template>
                <!--                <template v-slot:[`item.nombre`]="{ item }">-->
                <!--                  <pre>{{item}}</pre>-->
                <!--                </template>-->
                <template v-slot:[`item.estadoOrden`]="{ item }">
                  <v-chip dark small :color="obtenerEstado(item.estado_id).color">{{ item.estado }}</v-chip>
                </template>
                <template v-slot:group.header="{ items,isOpen,toggle }">
                  <td colspan="10" class="text-start">
                    <v-btn icon color="gray" @click="toggle()">
                      <v-icon>{{ isOpen ? 'mdi-minus' : 'mdi-plus' }}</v-icon>
                    </v-btn>
                   <b> N° Orden {{ items[0].orden }} ({{ items[0].fecha_vigencia }})</b>
                    <v-btn color="warning" x-small @click="reformularMedicamento(items)">Reformular/Conciliar</v-btn>
                  </td>
                </template>
                <template  v-slot:[`item.orden`]="{ item }">
                    <b>{{ item.orden }}</b>
                </template>
                <template v-slot:[`item.acciones`]="{ item }">
                                              <v-tooltip bottom v-if="item.estado_id === 1 || item.estado_id === 4">
                                                <template v-slot:activator="{ on, attrs }">
                                                  <v-icon
                                                    color="error"
                                                    class="mr-2"
                                                    v-bind="attrs"
                                                    v-on="on"
                                                    @click="abrirModalSuspender(item)">
                                                    mdi-cancel
                                                  </v-icon>
                                                </template>
                                                <span>Suspender Medicamento</span>
                                              </v-tooltip>
                                          </template>
              </v-data-table>


              <!--              <v-expansion-panels focusable>-->
              <!--                <v-expansion-panel-->
              <!--                  v-for="(item, index) in historicoMedicamentos"-->
              <!--                  :key="index"-->
              <!--                >-->
              <!--                  <v-expansion-panel-header-->
              <!--                    @click="listarHistoricoOrdenes(item)"-->
              <!--                  >-->
              <!--                    <h5>{{ item?.codesumi?.nombre }}</h5>-->
              <!--                  </v-expansion-panel-header>-->
              <!--                  <v-expansion-panel-content>-->
              <!--                    <v-col cols="12" sm="12" md="12">-->
              <!--                      <v-data-table-->
              <!--                        :headers="headersHistoricoMedicamentos"-->
              <!--                        :items="historicoOrdenes"-->
              <!--                        :loading="loading.table"-->
              <!--                      >-->
              <!--                        <template v-slot:[`item.estadoOrden`]="{ item }">-->
              <!--                          <v-chip-->
              <!--                            dark-->
              <!--                            small-->
              <!--                            :color="obtenerEstado(item.estado_id).color"-->
              <!--                            >{{ item.estado }}</v-chip-->
              <!--                          >-->
              <!--                        </template>-->
              <!--                        <template v-slot:[`item.acciones`]="{ item }">-->
              <!--                          <div class="d-flex justify-center">-->
              <!--                            <v-tooltip-->
              <!--                              bottom-->
              <!--                              v-if="-->
              <!--                                item.estado_id === 1 || item.estado_id === 4-->
              <!--                              "-->
              <!--                            >-->
              <!--                              <template v-slot:activator="{ on, attrs }">-->
              <!--                                <v-icon-->
              <!--                                  color="error"-->
              <!--                                  class="mr-2"-->
              <!--                                  v-bind="attrs"-->
              <!--                                  v-on="on"-->
              <!--                                  @click="abrirModalSuspender(item)"-->
              <!--                                >-->
              <!--                                  mdi-cancel-->
              <!--                                </v-icon>-->
              <!--                              </template>-->
              <!--                              <span>Suspender Medicamento</span>-->
              <!--                            </v-tooltip>-->
              <!--                            <v-tooltip bottom>-->
              <!--                              <template v-slot:activator="{ on, attrs }">-->
              <!--                                <v-icon-->
              <!--                                  color="success"-->
              <!--                                  class="mr-2"-->
              <!--                                  v-bind="attrs"-->
              <!--                                  v-on="on"-->
              <!--                                  @click="reformularMedicamento(item)"-->
              <!--                                >-->
              <!--                                  mdi-check-circle-outline-->
              <!--                                </v-icon>-->
              <!--                              </template>-->
              <!--                              <span>Reformular Medicamento</span>-->
              <!--                            </v-tooltip>-->
              <!--                          </div>-->
              <!--                        </template>-->
              <!--                      </v-data-table>-->
              <!--                    </v-col>-->
              <!--                  </v-expansion-panel-content>-->
              <!--                </v-expansion-panel>-->
              <!--              </v-expansion-panels>-->
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>

    <!-- Modal Suspender Medicamento -->
    <modalSuspender
      :mostrarModalSuspender.sync="mostrarModalSuspender"
      :orden="ordenSeleccionada"
      :ordenArticulo="ordenArticuloSeleccionada"
      :codesumi="codesumiSeleccionado"
      :afiliado="afiliadoSeleccionado"
      @suspenderMedicamento="suspenderMedicamento"
    />
  </div>
</template>
<script>
import modalSuspender from "@/components/ordenamiento/modalSuspender.vue";
import {mapActions} from "vuex";

export default {
  props: {
    consulta: {
      type: Number,
      required: true,
    },
  },
  components: {
    modalSuspender,
  },
  data() {
    return {
      buscar: '',
      loading: {
        table: false,
      },
      historicoMedicamentos: [],
      headersHistoricoMedicamentos: [
        {text: "N° Orden", value: "orden", align: "left"},
        {text: "Nombre", value: "codesumi.nombre", align: "right", groupable: false},
        {text: "Estado", value: "estadoOrden", align: "right", groupable: false},
        {text: "Mes", value: "paginacion", align: "right", groupable: false},
        {text: "Dosis", value: "dosis", align: "right", groupable: false},
        {text: "Vía", value: "codesumi.via", align: "right", groupable: false},
        {
          text: "Unidad de Presentación",
          value: "codesumi.unidad_presentacion",
          align: "right",
          groupable: false
        },
        {text: "Frecuencia", value: "frecuencia", align: "right", groupable: false},
        {
          text: "Cantidad Ordenada",
          value: "cantidad_medico",
          align: "right", groupable: false
        },
        {text: "Duración", value: "duracion", align: "right", groupable: false},
        {text: "Observación", value: "observacion", align: "right", groupable: false},
        {
          text: "Acciones",
          value: "acciones",
          align: "right",
          groupable: false
        },
      ],
      historicoOrdenes: [],
      mostrarModalSuspender: false,
      ordenSeleccionada: null,
      ordenArticuloSeleccionada: null,
      codesumiSeleccionado: null,
      afiliadoSeleccionado: null,
    };
  },
  mounted() {
    this.listarHistoricoOrdenes();
  },
  filters: {
    descripcion: (item) => {
      if (item.unidad_tiempo == "Horas")
        return `${item.dosis} ${item.codesumi.unidad_presentacion} ${item.codesumi.via} cada ${item.frecuencia} Horas por ${item.duracion} días`;
      else
        return `${item.dosis} ${item.codesumi.unidad_presentacion} ${item.codesumi.via} cada ${item.frecuencia} Días por ${item.duracion} días`;
    },
  },
  methods: {
    ...mapActions("app", ["setPreload"]),

    listarHistoricoMedicamentos() {
      this.setPreload(true);
      this.$axios
        .post("/ordenamiento/historicoMedicamentos6meses", {
          consulta_id: this.consulta,
        })
        .then((res) => {
          this.historicoMedicamentos = res.data;
        })
        .catch((err) => {
          this.$toast.error(
            "Ocurrió un error al cargar historico de medicamentos del afiliado"
          );
        })
        .finally(() => {
          this.setPreload(false);
        });
    },

    listarHistoricoOrdenes() {
      this.historicoOrdenes = [];
      this.loading.table = true;
      this.$axios
        .post("/ordenamiento/historicoOrden6meses", {'consulta': this.consulta})
        .then((res) => {
          this.historicoOrdenes = res.data;
        })
        .catch((err) => {
          this.$toast.error(
            "Ocurrió un error al cargar historico de órdenes del afiliado"
          );
        })
        .finally(() => {
          this.loading.table = false;
        });
    },

    obtenerEstado(estadoId) {
      switch (parseInt(estadoId)) {
        case 1:
        case 4:
          return {color: "success"};
        case 3:
          return {color: "warning"};
        case 5:
        case 20:
        case 21:
        case 50:
        case 44:
          return {color: "error"};
        case 34:
          return {color: "info"};
        default:
          return {color: "gray"};
      }
    },

    abrirModalSuspender(item) {
      this.codesumiSeleccionado = item.codesumi_id;
      this.ordenSeleccionada = item.orden;
      this.ordenArticuloSeleccionada = item.ordenArticulo;
      this.afiliadoSeleccionado = item.afiliado_id;
      this.mostrarModalSuspender = true;
    },

    suspenderMedicamento(item) {
      this.setPreload(true);
      this.$axios
        .post("/ordenamiento/suspender", {
          orden: item.orden,
          ordenArticulo: item.ordenArticulo,
          codesumi: item.codesumi,
          motivo: item.motivo,
        })
        .then(() => {
          this.listarHistoricoMedicamentos();
          this.mostrarModalSuspender = false;
          const itemOrden = {
            codesumi_id: this.codesumiSeleccionado,
            afiliado_id: this.afiliadoSeleccionado,
          };
          this.listarHistoricoOrdenes(itemOrden);
          this.$toast.success("Medicamento suspendido correctamente");
          this.$emit("medicamentoSuspendido");
        })
        .catch(() => {
          this.$toast.error("Ocurrió un error al suspender el medicamento");
        })
        .finally(() => {
          this.setPreload(false);
        });
    },

    reformularMedicamento(items) {
      let articulos = [];
      items.forEach((item) => {
        const data = {
          articulo: {
            codesumi: item.codesumi
          },
          cantidadMedico: item.cantidad_medico,
          dosis: item.dosis,
          duracion: item.duracion,
          fechaVigencia: this.$moment().format("YYYY-MM-DD"),
          frecuencia: item.frecuencia,
          meses: item.meses,
          observacion: item.observacion,
          presentacion: item.codesumi.unidad_presentacion,
          rep_id: item.rep_id,
          tiempo: item.unidad_tiempo,
          via: item.codesumi.via,
          descripcion: this.$options.filters.descripcion(item)
        };
        articulos.push(data)
      })
      this.$emit("reformularMedicamento", articulos);
    },
  },
};
</script>
