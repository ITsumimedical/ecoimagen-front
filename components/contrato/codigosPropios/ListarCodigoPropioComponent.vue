<template>
  <div>
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

    <v-card class="mx-100">
      <div>
        <v-toolbar flat>
          <v-spacer></v-spacer>
          <v-btn color="success" class="white--text ma-2 px-6" small
            @click="dialogs.form = true">Crear<v-icon>mdi-plus</v-icon></v-btn>
            <CargaMasivaCodigosPropiosComponent  @cerrar="getCodigoPropios"/>
        </v-toolbar>

        <v-row class="mx-2">
          <v-col md="2" lg="2" xl="2" sm="6" cols>
            <v-text-field dense v-model="filtro.codigo" label="Codigo propio" outlined>
            </v-text-field>
          </v-col>

          <v-col md="3" lg="3" xl="3" sm="6" cols>
            <v-text-field dense v-model="filtro.nombre" label="Nombre" outlined>
            </v-text-field>
          </v-col>

          <v-col md="2" lg="2" xl="2" sm="6" cols>
            <v-text-field dense v-model="filtro.codigoCups" label="Codigo CUPS" outlined>
            </v-text-field>
          </v-col>

          <v-col md="3" lg="3" xl="3" sm="6" cols>
            <v-autocomplete :items="[
              { id: 1, nombre: 'ambulatorio' },
              { id: 2, nombre: 'hospilatario' },
              { id: 3, nombre: 'Mixto' },
            ]" item-text="nombre" item-value="id" dense v-model="filtro.ambito_id" label="Ambito" outlined>
            </v-autocomplete>
          </v-col>

          <v-col md="2" lg="2" xl="2" sm="6" cols>
            <v-btn-toggle background-color="white" dark>
              <v-btn small color="success" @click="getCodigoPropios()">Filtrar</v-btn>
              <v-btn small class="ml-2" color="error" @click="limpiar()">Limpiar</v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
      </div>

      <v-divider class="mt-2"></v-divider>

      <v-data-table :headers="headers" :items="codigos_propios" class="elevation-1 mt-4" hide-default-footer
        disable-pagination no-data-text="Sin datos para mostrar" dense>
        <template v-slot:[`item.activo`]="{ item }">
          <v-chip small dark :color="item.activo ? 'success' : 'error'">{{
            item.activo  ? "Activo" : "Inactivo"
          }}</v-chip>
        </template>

        <template v-slot:[`item.diagnostico_requerido`]="{ item }">
          <v-chip small dark :color="item.diagnostico_requerido ? 'success' : 'error'">{{ item.diagnostico_requerido ?
            "Si" : "No" }}</v-chip>
        </template>

        <template v-slot:[`item.requiere_auditoria`]="{ item }">
          <v-chip small dark :color="item.requiere_auditoria ? 'success' : 'error'">{{ item.requiere_auditoria ? "Si" :
            "No" }}</v-chip>
        </template>

        <template v-slot:[`item.quirurgico`]="{ item }">
          <v-chip small dark :color="item.quirurgico ? 'success' : 'error'">{{
            item.quirurgico ? "Si" : "No"
          }}</v-chip>
        </template>

        <template v-slot:[`item.valor`]="{ item }">
          {{ formatCurrency(item.valor) }}
        </template>

        <template v-slot:[`item.acciones`]="{ item }">
          <v-tooltip top v-if="$can('cups.guardar')">
            <template v-slot:activator="{ on, attrs }">
              <v-icon :color="item.activo ? 'error' : 'success'" small v-bind="attrs" v-on="on"
                @click="cambiarEstadoItem(item.id)">
                {{ item.activo ? 'mdi-toggle-switch' : 'mdi-toggle-switch-off'}}
              </v-icon>
            </template>
            <span>{{ item.activo ? "Inactivar" : "Activar" }}</span>
          </v-tooltip>
          <v-tooltip top v-if="$can('cups.guardar')">
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="warning" small v-bind="attrs" v-on="on" @click="editarItem(item)">
                mdi-grease-pencil
              </v-icon>
            </template>
            <span>Editar</span>
          </v-tooltip>
        </template>
      </v-data-table>

      <v-row no-gutters>
        <v-col md="9" lg="9" xl="11" sm="11" class="px-2">
          <v-pagination v-model="pagina" class="my-4" :length="total" :total-visible="9"
            @input="getCodigoPropios()"></v-pagination>
        </v-col>
        <v-col md="3" lg="3" xl="1" sm="1" class="px-2" cols style="min-width: 100px">
          <v-select class="my-4" v-model="opcionActual" :items="opciones" dense solo small
            @change="getCodigoPropios()"></v-select>
        </v-col>
      </v-row>
    </v-card>

    <v-dialog persistent v-model="dialogs.form" max-width="800px">
      <FormCodigoPropioComponent :editar="editando" :codigo_propio_id="codigo_propio_id" @cerrar="
        (dialogs.form = false), (editando = false), (codigo_propio_id = null)
        " @submit="getCodigoPropios()" />
    </v-dialog>
  </div>
</template>
<script>
import CargaMasivaCodigosPropiosComponent from './CargaMasivaCodigosPropiosComponent.vue';
import FormCodigoPropioComponent from "./FormCodigoPropioComponent.vue";
export default {
  middleware({ $can, redirect }) {
    if (!$can("contratos.servicios.codigos_propios")) {
      return redirect("/");
    }
  },
  components: {
    FormCodigoPropioComponent,
    CargaMasivaCodigosPropiosComponent
  },
  name: "listar-codigos-propios",
  data() {
    return {
      headers: [
        { text: "Id", value: "id" },
        { text: "Codigo", value: "codigo" },
        { text: "Nombre", value: "nombre" },
        { text: "Cup", value: "cup.codigo" },
        { text: "Quirurgico", value: "quirurgico", align: "center" },
        {
          text: "Diagnóstico requerido",
          value: "diagnostico_requerido",
          align: "center",
        },
        {
          text: "Requiere auditoria",
          value: "requiere_auditoria",
          align: "center",
        },
        { text: "Periodicidad", value: "periodicidad", align: "center" },
        {
          text: "Nivel Ordenamiento",
          value: "nivel_ordenamiento",
          align: "center",
        },
        {
          text: "Cantidad Max",
          value: "cantidad_max_ordenamiento",
          align: "center",
        },
        { text: "Ambito", value: "ambito.nombre" },
        { text: "Valor", value: "valor" },
        { text: "Estado", value: "activo" },
        { text: "Acciones", value: "acciones", sortable: false },
      ],
      codigos_propios: [],
      editando: false,
      codigo_propio_id: null,
      buscar: null,
      preload: false,
      dialogs: {
        form: null,
      },
      opciones: [5, 10, 20, 50, 100],
      opcionActual: 10,
      filtro: {
        codigo: null,
        nombre: null,
        codigoCups: null,
        ambito_id: null,
      },
      pagina: 1,
      total: 0,
    };
  },

  mounted() {
    this.getCodigoPropios();
  },

  methods: {
    getCodigoPropios() {
      (this.preload = true),
        this.$axios
          .post(
            "codigo-propio/listar?page=" +
            this.pagina +
            "&cant=" +
            this.opcionActual,
            this.filtro
          )
          .then((res) => {
            this.codigos_propios = res.data.data.data;
            this.total = res.data.data.last_page;
            this.preload = false;
          })
          .catch((error) => {
            this.preload = false;
            console.log(error.response);
          });
    },

    cambiarEstadoItem(id) {
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
          this.$axios.put("/codigo-propio/cambiar-estado/" + id)
            .then((res) => {
              this.$toast.success("Se cambio el estado del cup propio correctamente");
              this.preload = false;
              this.getCodigoPropios();
            })
            .catch((error) => {
              this.preload = false;
              this.$toast.error("Error al cambiar el estado del cup propio");
            });
        }
      });
    },

    editarItem(item) {
      this.dialogs.form = true;
      this.editando = true;
      this.codigo_propio_id = item.id;
    },

    formatCurrency(value) {
        if (value !== null && value !== undefined) {
          // Utilizamos Intl.NumberFormat para formatear el número
          return '$' + new Intl.NumberFormat('es-CO', {
            minimumFractionDigits: 0
          }).format(value);
        } else {
          return '';
        }
      },

    limpiar() {
      this.preload = true;
      for (const prop of Object.getOwnPropertyNames(this.filtro)) {
        this.filtro[prop] = null;
      }
      this.preload = false;
      this.getCodigoPropios();
    },
  },
};
</script>
