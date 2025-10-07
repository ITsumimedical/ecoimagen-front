<template>
  <div>
    <!-- Preload -->
    <template>
      <div class="text-center">
        <v-dialog v-model="preload" persistent width="300">
          <v-card color="primary" dark>
            <v-card-text>
              Tranquilo procesamos tu solicitud !
              <v-progress-linear
                indeterminate
                color="white"
                class="mb-0"
              ></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
    </template>

    <!-- card de botones y filtros -->
    <v-card class="mx-100">
      <div>
        <v-toolbar flat>
          <v-spacer></v-spacer>
          <v-btn
            v-if="$can('paqueteServicio.crear')"
            color="success"
            class="white--text ma-2 px-6"
            small
            @click="dialogs.form = true"
            >Crear<v-icon>mdi-plus</v-icon></v-btn
          >
        </v-toolbar>

        <v-row class="mx-2">
          <v-col md="2" lg="2" xl="2" sm="6" cols>
            <v-text-field
              dense
              v-model="filtro.codigo_paquete"
              label="Codigo propio"
              outlined
            >
            </v-text-field>
          </v-col>

          <v-col md="2" lg="2" xl="2" sm="6" cols>
            <v-text-field
              dense
              v-model="filtro.codigo_cup"
              label="Codigo Cups"
              outlined
            >
            </v-text-field>
          </v-col>

          <v-col md="3" lg="3" xl="3" sm="6" cols>
            <v-text-field dense v-model="filtro.nombre" label="Nombre" outlined>
            </v-text-field>
          </v-col>

          <v-col md="2" lg="2" xl="2" sm="6" cols>
            <v-btn-toggle background-color="white" dark>
              <v-btn
                v-if="$can('paqueteServicio.listar')"
                small
                color="success"
                @click="getPaquetesServicios()"
                >Filtrar</v-btn
              >
              <v-btn
                v-if="$can('paqueteServicio.listar')"
                small
                class="ml-2"
                color="error"
                >Limpiar</v-btn
              >
            </v-btn-toggle>
          </v-col>
        </v-row>
      </div>

      <v-divider class="mt-2"></v-divider>

      <v-data-table
        dense
        :headers="headers"
        :items="paquetes"
        class="elevation-1 mt-4"
        loading-text="cargando..."
        hide-default-footer
        disable-pagination
        no-data-text="Sin datos para mostrar"
      >
        <template v-slot:[`item.activo`]="{ item }">
          <v-chip small :color="getEstado(item.activo)" dark>
            {{ item.activo ? "Activo" : "Inactivo" }}</v-chip
          >
        </template>

        <template v-slot:[`item.acciones`]="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                color="primary"
                small
                v-bind="attrs"
                v-on="on"
                @click="agregarServicios(item)"
              >
                mdi-book-open
              </v-icon>
            </template>
            <span>Servicios</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                color="warning"
                small
                v-bind="attrs"
                v-on="on"
                @click="editarItem(item)"
              >
                mdi-grease-pencil
              </v-icon>
            </template>
            <span>Editar</span>
          </v-tooltip>

          <v-tooltip top v-if="$can('paqueteServicio.actualizar')">
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                :color="item.activo ? 'error' : 'success'"
                small
                v-bind="attrs"
                v-on="on"
                @click="cambiarEstadoItem(item.id)"
              >
              {{ item.activo ? "mdi-delete" : "mdi-delete-empty" }}
              </v-icon>
            </template>
            <span>{{ item.activo ? "Inactivar" : "Activar" }}</span>
          </v-tooltip>
        </template>
      </v-data-table>

      <v-dialog persistent v-model="dialogs.form" max-width="500px">
        <FormPaqueteServicioComponent
          :editar="editando"
          :paquete_servicio_id="paquete_servicio_id"
          @cerrar="
            (dialogs.form = false),
              (editando = false),
              (paquete_servicio_id = null)
          "
          @submit="getPaquetesServicios()"
        />
      </v-dialog>

      <v-dialog
        persistent
        v-model="dialogs.servicios"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="cerrarDialogServicios">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Servicios</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <template>
              <v-tabs
                v-model="tab"
                background-color="white"
                centered
                dark
                icons-and-text
              >
                <v-tabs-slider color="success"></v-tabs-slider>
                <v-tab href="#tab-1" class="black--text"> Cups </v-tab>
                <v-tab href="#tab-2" class="black--text">
                  Códigos propios
                </v-tab>
                <v-tabs-items v-model="tab">
                  <v-tab-item :value="'tab-1'">
                    <ListarCupsPaqueteServicioComponent :paquete_servicio_id="paquete_servicio_id" :isOpen="dialogs.servicios" />
                  </v-tab-item>
                  <v-tab-item :value="'tab-2'">
                    <ListarPropiosPaqueteServicioComponent :paquete_servicio_id="paquete_servicio_id" :isOpen="dialogs.servicios" />
                  </v-tab-item>
                </v-tabs-items>
              </v-tabs>
            </template>
            <style lang="scss" scoped></style>
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-row no-gutters>
        <v-col md="9" lg="9" xl="11" sm="11" class="px-2">
          <v-pagination
            v-model="pagina"
            class="my-4"
            :length="total"
            :total-visible="9"
            @input="getPaquetesServicios()"
          ></v-pagination>
        </v-col>
        <v-col
          md="3"
          lg="3"
          xl="1"
          sm="1"
          class="px-2"
          cols
          style="min-width: 100px"
        >
          <v-select
            class="my-4"
            v-model="opcionActual"
            :items="opciones"
            dense
            solo
            small
            @change="getPaquetesServicios()"
          ></v-select>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import FormPaqueteServicioComponent from "@/components/contrato/PaqueteServicio/FormPaqueteServicioComponent.vue";
import ListarCupsPaqueteServicioComponent from "@/components/contrato/PaqueteServicio/ListarCupsPaqueteServicios.vue";
import ListarPropiosPaqueteServicioComponent from "@/components/contrato/PaqueteServicio/ListarPropiosPaqueteServicios.vue";
export default {
  middleware({ $can, redirect }) {
    if (!$can("contratos.servicios.paquetes")) {
      return redirect("/");
    }
  },
  name: "lista-paquetes",
  components: {
    FormPaqueteServicioComponent,
    ListarCupsPaqueteServicioComponent,
    ListarPropiosPaqueteServicioComponent,
  },
  data() {
    return {
      tab: null,
      headers: [
        { text: "ID", value: "id" },
        { text: "Codigo", value: "codigo" },
        { text: "Cups", value: "cups.codigo" },
        { text: "Nombre", value: "nombre" },
        { text: "Precio", value: "precio" },
        { text: "N° Cups", value: "cups_conteo_count", align: "center" },
        { text: "N° Propios", value: "propios_count", align: "center" },
        { text: "Estado", value: "activo" },
        { text: "Acciones", value: "acciones" },
      ],
      paquetes: [],
      editando: false,
      paquete_servicio_id: null,
      dialogs: {
        form: false,
        servicios: false,
      },
      filtro: {
        codigo_paquete: null,
        nombre: null,
        codigo_cup: null,
      },
      preload: false,
      opciones: [5, 10, 15, 20, 50, 100],
      opcionActual: 15,
      pagina: 1,
      total: 0,
    };
  },

  mounted() {
    this.getPaquetesServicios();
  },

  methods: {
    /** Obtiene los paquetes */
    getPaquetesServicios() {
      this.preload = true;
      this.$axios
        .post(
          "/paquete-servicio/listar?page=" +
            this.pagina +
            "&cant=" +
            this.opcionActual,
          this.filtro
        )
        .then((res) => {
          this.preload = false;
          this.paquetes = res.data.data;
          this.total = res.data.last_page;
        })
        .catch((error) => {
          this.preload = false;
          this.$toast.error("Error al cargar los paquetes de servicio");
        });
    },

    async cambiarEstadoItem(item) {
      this.$swal({
        title: "Desea cambiarle el estado?",
        text: "Al aceptar este mensaje, se realizara el cambio del estado",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
        confirmButtonText: "Aceptar",
      }).then((result) => {
        if (result.value) {
          this.preload = true;
          this.$axios
            .put("/paquete-servicio/cambiar-estado/" + item)
            .then((res) => {
              this.preload = false;
              this.$toast.success(
                "Se cambio el estado del servicio correctamente"
              );
              this.getPaquetesServicios();
            })
            .catch((error) => {
              this.preload = false;
              this.$toast.error("No se ha podido cargar los datos");
            });
        }
      });
    },

    editarItem(item) {
      this.dialogs.form = true;
      this.editando = true;
      this.paquete_servicio_id = item.id;
    },

    agregarServicios(item) {
      this.dialogs.servicios = true;
      this.paquete_servicio_id = item.id;
    },

    getEstado(estado) {
      if (estado) return "success";
      else return "error";
    },

    cerrarDialogServicios(){
      this.dialogs.servicios = false
      this.getPaquetesServicios()
    }
  },
};
</script>
