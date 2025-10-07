<template>
  <div>
    <v-card elevation="1">
      <v-card-title>
        <v-toolbar flat>
          <v-toolbar-title>
            <div class="d-flex align-center">
              <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
              <span>Rutas</span>
            </div>
          </v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
        </v-toolbar>
      </v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col cols="12" sm="10" md="10">
            <v-text-field label="Buscar" v-model="buscar"></v-text-field>
          </v-col>
          <v-col cols="12" sm="2" md="2">
            <v-btn color="success" block small dark @click="abrirModalCrear()"
              >Crear <v-icon small right>mdi-plus-circle-outline</v-icon></v-btn
            >
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" sm="12" md="12">
            <v-data-table
              :headers="headersRutas"
              :items="this.rutas"
              dense
              :search="buscar"
              :loading="loading.rutas"
              hide-default-footer
              disable-pagination
              :items-per-page="paginacion.cantidadRegistros"
              loading-text="Cargando ... Porfavor espere ."
              no-data-text="Sin datos para Mostrar"
            >
              <template v-slot:[`item.acciones`]="{ item }">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      color="warning"
                      small
                      class="mr-2"
                      v-bind="attrs"
                      v-on="on"
                      @click="abrirModalEditar(item)"
                    >
                      mdi-pencil
                    </v-icon>
                  </template>
                  <span>Editar</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="11" md="11">
            <v-pagination
              v-model="paginacion.pagina"
              :length="paginacion.total"
              :total-visible="9"
              @input="listarRutas()"
            >
            </v-pagination>
          </v-col>

          <v-col cols="12" sm="1" md="1">
            <v-select
              dense
              outlined
              v-model="paginacion.cantidadRegistros"
              :items="[5, 10, 20, 50, 100]"
              label="Registros por Página"
              @change="listarRutas()"
            ></v-select>
          </v-col>
          <v-actions> </v-actions>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- modales -->
    <modalCrearRuta
      :mostrarModalCrear.sync="mostrarModalCrear"
      @recargarRutas="listarRutas()"
    />
    <modalEditarRuta
      :mostrarModalEditar.sync="mostrarModalEditar"
      @recargarRutas="listarRutas()"
      :rutaSeleccionada="rutaSeleccionada"
    />
  </div>
</template>

<script>
import modalCrearRuta from "@/components/api/rutas/modalCrearRuta.vue";
import modalEditarRuta from "@/components/api/rutas/modalEditarRuta.vue";
export default {
  middleware({ $can, redirect }) {
    if (!$can("api.tipoRutas")) {
      return redirect("/");
    }
  },
  components: {
    modalCrearRuta,
    modalEditarRuta,
  },
  data() {
    return {
      loading: {
        rutas: false,
      },
      rutas: [],
      buscar: "",
      headersRutas: [
        {
          text: "ID",
          value: "id",
          align: "center",
        },
        {
          text: "Nombre",
          value: "nombre",
          align: "center",
        },
        {
          text: "Descripción",
          value: "descripcion",
          align: "center",
        },
        {
          text: "Acciones",
          value: "acciones",
          align: "center",
          sortable: false,
        },
      ],
      paginacion: {
        pagina: 1,
        cantidadRegistros: 10,
        total: 0,
      },
      mostrarModalCrear: false,
      mostrarModalEditar: false,
      rutaSeleccionada: {},
    };
  },
  mounted() {
    this.listarRutas();
  },
  methods: {
    async listarRutas() {
      const data = {
        paginacion: this.paginacion,
      };
      try {
        this.loading.rutas = true;
        const response = await this.$axios.post(
          "/tipo-rutas/listar-todas",
          data
        );
        this.rutas = response.data.data;
        this.paginacion.total = response.data.last_page;
      } catch (error) {
        this.$toast.error(response.error.data.mensaje);
      } finally {
        this.loading.rutas = false;
      }
    },
    abrirModalCrear() {
      this.mostrarModalCrear = true;
    },

    abrirModalEditar(item) {
      this.mostrarModalEditar = true;
      this.rutaSeleccionada=item;
    },
  },
};
</script>
