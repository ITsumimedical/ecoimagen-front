<template>
  <v-row>
    <v-col cols="12" sm="12" md="12">
      <v-alert class="text-center" dense text outlined type="info" icon="mdi-book-open-page-variant">
        <b>ANTECEDENTES FARMACOLOGICOS, TRAUMATICOS, HOSPITALARIOS</b></v-alert>
    </v-col>
    <v-col cols="12" sm="6" md="3">
      <v-autocomplete
        :items="antecedentesT"
        label="Tipo de antecedentes"
        item-text="name"
        v-model="antecedentes.antecedente"
        dense
        outlined
        solo
      >
      </v-autocomplete>
    </v-col>
    <v-col cols="12" sm="6" md="7" v-if="antecedentes.antecedente != null">
      <v-textarea
        name="input-7-1"
        dense
        outlined
        auto-grow
        v-model="antecedentes.descripcion"
        label="Descripcion"
      >
      </v-textarea>
    </v-col>

    <v-col
      cols="12"
      sm="6"
      md="2"
      class="mt-12"
      v-if="antecedentes.antecedente != null"
    >
      <v-btn color="boton" block small dark @click="addAntecedente()"
        >Agregar</v-btn
      >
    </v-col>

    <v-col cols="12" sm="12" md="12">
      <v-alert
        dense
        text
        outlined
        type="info"
        color="blue-grey"
        class="text-center"
      >
        <b>Pre - ingresados</b>
      </v-alert>
      <v-data-table
        :headers="headers"
        dense
        :items="antecedentesPreingresados"
        class="elevation-1 mt-4"
        hide-default-footer
        disable-pagination
        no-data-text="Sin datos para mostrar"
      >
        <template v-slot:[`item.eliminar`]="{ index }">
          <v-btn
            color="error"
            icon
            small
            @click="antecedentesPreingresados.splice(index, 1)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-col>
    <v-row align="center" justify="space-around">
      <v-btn tile color="success" class="mt-2" @click="guardar()">
        Guardar
      </v-btn>
    </v-row>
    <v-col cols="12" sm="12" md="12" class="mt-2">
      <v-alert
        dense
        text
        outlined
        type="info"
        color="blue-grey"
        class="text-center"
      >
        <b>Historico Antecedentes</b>
      </v-alert>
      <v-data-table
        :headers="headersHistorico"
        :items="listarAntecedentes"
        dense
        hide-default-footer
        disable-pagination
        no-data-text="Sin datos para mostrar"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                color="warning"
                small
                class="mr-2"
                v-bind="attrs"
                v-on="on"
                @click="editar(item)"
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
</template>

<script>
export default {
  name: "WorkspaceJsonAntecedentesComponent",

  data() {
    return {
      loading: false,
      listarAntecedentes: [],
      antecedentes: {
        antecedente: null,
        descripcion: "",
      },
      antecedentesPreingresados: [],
      antecedentesT: [
        {
          name: "Traumaticos",
        },
        {
          name: "Accidentes",
        },
        {
          name: "Tratamientos cronicos",
        },
        {
          name: "Tratamiento con biologicos",
        },
        {
          name: "Recibe quimioterapia",
        },
        {
          name: "Consulta a urgencias",
        },
        {
          name: "Hospitalizaciones en el ultimo año",
        },
        {
          name: "Más de 3 hospitalizaciones en el ultimo año",
        },
        {
          name: "Hospitalizaciones mayores a 2 semanas en el último año",
        },
        {
          name: "Hospitalización en el UCI en el ultimo año",
        },
      ],
      headers: [
        {
          text: "Antecedente",
          value: "antecedente",
        },
        {
          text: "Descripcion",
          value: "descripcion",
        },
        {
          text: "Eliminar",
          value: "eliminar",
        },
      ],
      fechaRegistro: "",
      headersHistorico: [
        {
          text: "Antecedentes",
          value: "antecedentes",
        },
        {
          text: "descripcion",
          value: "descripcion",
        },
        {
          text: "Fecha registro",
          value: "created_at",
        },
      ],
    };
  },

  mounted() {
    this.listar();
  },

  methods: {
    addAntecedente() {
      if (this.antecedentes.antecedente == "") {
        return this.$toast.error("Debe seleccionar una Antecendete");
      }
      if (this.antecedentes.descripcion == "") {
        return this.$toast.error(
          "Debe ingresar una descripción del antecente!"
        );
      }
      this.antecedentesPreingresados.push({
        ...this.antecedentes,
      });
      this.limpiarFiltro();
    },
    guardar() {
      if (this.antecedentesPreingresados[0].antecedente == "") {
        return this.$toast.error("Debe seleccionar una Antecendete");
      }
      this.$axios
        .post("/antecedentes/guardar", this.antecedentesPreingresados)
        .then((res) => {
          this.$toats.success(res.data.mensaje);
          this.limpiarFiltro();
        })
        .catch((err) => {
          console.log("error", err);
        });
    },
    listar() {
      this.$axios
        .get("/antecedentes/listar")
        .then((res) => {
          this.listarAntecedentes = res.data;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    limpiarFiltro() {
      for (const prop of Object.getOwnPropertyNames(this.antecedentes)) {
        this.antecedentes[prop] = null;
      }
      this.listar();
    },
    validarErrores() {
      return [];
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
