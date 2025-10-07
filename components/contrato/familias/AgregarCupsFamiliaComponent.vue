<template>
  <div>
    <v-card class="mx-100">
      <v-card-title class="claro oscuro--text mb-4">{{
          familia.nombre
        }}
      </v-card-title>
      <v-row class="mx-2">
        <v-col md="10" lg="10" xl="10" sm="6" cols>
          <v-autocomplete
            v-model="select"
            outlined
            dense
            multiple
            label="Cups"
            :items="cups"
            item-text="nombre"
            return-object
          ></v-autocomplete>
        </v-col>
        <v-col md="2" lg="2" xl="2" sm="6" cols>
          <v-btn-toggle background-color="white" dark>
            <v-btn small color="success" @click="agregar()">Agregar</v-btn>
            <v-btn small class="ml-2" color="error">Limpiar</v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>

      <v-data-table
        :headers="headers"
        :items="form.cups"
        item-key="id"
        class="elevation-1 mt-4"
        loading-text="cargando..."
        no-data-text="Sin datos para mostrar"
        dense
      >
        <template v-slot:item.quirurgico="{ item }">
          <v-chip small dark :color="item.quirurgico ? 'success' : 'error'">{{
              item.quirurgico ? "Si" : "No"
            }}
          </v-chip>
        </template>

        <template v-slot:item.diagnostico_requerido="{ item }">
          <v-chip
            small
            dark
            :color="item.diagnostico_requerido ? 'success' : 'error'"
          >
            {{ item.diagnostico_requerido ? "Si" : "No" }}
          </v-chip>
        </template>

        <template v-slot:item.requiere_auditoria="{ item }">
          <v-chip
            small
            dark
            :color="item.requiere_auditoria ? 'success' : 'error'"
          >
            {{ item.requiere_auditoria ? "Si" : "No" }}
          </v-chip>
        </template>

        <template v-slot:item.activo="{ item }">
          <v-chip small dark :color="item.activo ? 'success' : 'error'">{{
              item.activo ? "Activo" : "Inactivo"
            }}
          </v-chip>
        </template>

        <template v-slot:item.acciones="{ item }">
          <v-tooltip top v-if="$can('cups.guardar')">
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                color="error"
                small
                v-bind="attrs"
                v-on="on"
                @click="eliminar(item)"
              >
                mdi-delete
              </v-icon>
            </template>
            <span>Eliminar</span>
          </v-tooltip>
        </template>
      </v-data-table>

      <v-card-actions class="justify-end">
        <v-btn color="error" @click="cerrar()">cerrar</v-btn>
        <v-btn color="primary" @click="submit()">Guardar</v-btn>
      </v-card-actions>
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
    </v-card>
  </div>
</template>

<script>
export default {
  middleware({$can, redirect}) {
    if (!$can("blog.vista")) {
      return redirect("/");
    }
  },
  name: "AgregarCups",

  props: {
    familia_id: Number,
    editar: Boolean,
  },

  watch: {
    familia_id() {
      if (this.editar) {
        this.getFamilia();
      }
    },
  },

  data() {
    return {
      select: [],
      buscar: null,
      preload: false,
      headers: [
        {text: "Codigo", value: "codigo"},
        {text: "Nombre", value: "nombre"},
        {text: "Genero", value: "genero"},
        {text: "Edad inicial", value: "edad_inicial"},
        {text: "Edad final", value: "edad_final"},
        {text: "Archivo", value: "archivo"},
        {text: "Quirurgico", value: "quirurgico"},
        {text: "Diagnóstico requerido", value: "diagnostico_requerido"},
        {text: "Requiere auditoria", value: "requiere_auditoria"},
        {text: "Ambito", value: "ambito.nombre"},
        {text: "Estado", value: "activo"},
        {text: "Acciones", value: "acciones", sortable: false},
      ],
      cups: [],
      familia: {
        nombre: null,
        cups: [],
      },
      opciones: [5, 10, 15, 20, 50, 100],
      opcionActual: 15,
      pagina: 1,
      total: 0,
      form: {
        cups: [],
      },
      loading: false,
    };
  },

  mounted() {
    this.getCups();
    if (this.editar) {
      this.getFamilia();
    }
  },

  methods: {
    async submit() {
      this.preload = true
      try {
        const request = {
          cups: this.form.cups.map((item) => item.id),
        };
        this.preload = false
        await this.$axios.put(
          "familia/sincronizar-cups/" + this.familia_id,
          request
        );
        this.$toast.success("Los cups se actualizaron correctamente");
        this.preload = false
        this.$emit("submit");
      } catch (error) {
        console.log(error.response);
        this.preload = false
      }
    },

    async getCups() {
      try {
        this.loading = true;
        const {data} = await this.$axios.get("/cup");
        this.cups = data.data;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },

    getFamilia() {
      this.preload = true;
      this.$axios.get("/familia/consultar/" + this.familia_id + "?clave=id&with=cups").then(res => {
        console.log(res.data);
        this.form.cups = res.data.cups;
        this.familia.nombre = res.data.nombre;
        this.preload = false
      }).catch(error => {
        this.preload = false
        console.log(error.response);
      });
    },

    agregar() {
      /** Validamos que haya algo seleccionado */
      if (!this.select) {
        return false;
      }
      this.preload = true
      this.select.forEach((item) => {
        /** Buscamos que el item no exista, antes de agregarlo */
        const indice = this.form.cups.findIndex(
          (item_find) => item_find.id === item.id
        );
        if (indice >= 0) {
          this.preload = false
          return false;
        }
        this.form.cups.push(item);
        this.select = null;
        this.preload = false
      });
    },

    eliminar(item) {
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
          const indice = this.form.cups.findIndex(
            (item_find) => item_find.id === item.id
          );
          const array = this.form.cups;
          array.splice(indice, 1);
          this.form.cups = array;
        }
      })
    },

    cerrar() {
      this.form.cups = [];
      this.familia.nombre = null;
      this.$emit('cerrar');
    }
  },
};
</script>
