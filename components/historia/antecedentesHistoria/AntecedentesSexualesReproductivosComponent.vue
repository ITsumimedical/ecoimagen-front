<template>
  <v-card fluid>
    <v-container fluid>
      <v-row>
        <v-col cols="12" sm="12" md="12">
          <v-alert dense text outlined type="info" color="blue-grey" class="text-center">
            <b>Antecedentes sexuales y reproductivos</b>
          </v-alert>
        </v-col>
        <v-col cols="12" sm="6" md="5">
          <v-autocomplete :items="antecedentesT" label="Tipo de antecedentes" item-text="name"
            v-model="antecedentesSexuales.tipo_antecedentes_sexuales" dense outlined>
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="4" v-if="antecedentesSexuales.tipo_antecedentes_sexuales == 'Orientación sexual'">
          <v-autocomplete :items="tipoOrientacionSexual" label="Tipo de orientacion sexual" item-text="name"
            v-model="antecedentesSexuales.tipo_orientacion_sexual" dense outlined>
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="4" v-if="
            antecedentesSexuales.tipo_antecedentes_sexuales ==
            'Identidad de genero'
          ">
          <v-autocomplete :items="tipoIdentidadGenero" label="Tipo orientacion sexual" item-text="name"
            v-model="antecedentesSexuales.tipo_identidad_genero" dense outlined>
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="3" v-if="
            antecedentesSexuales.tipo_antecedentes_sexuales == 'Espermarquia'
          ">
          <v-autocomplete :items="siNonoAplica" label="Si / No / No aplica" item-text="name"
            v-model="antecedentesSexuales.resultado" dense outlined>
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="3" v-if="
            antecedentesSexuales.tipo_antecedentes_sexuales ==
            'Inicio de relaciones sexuales'
          ">
          <v-text-field v-model="antecedentesSexuales.edad" type="number" min="0" oninput="validity.valid||(value='');"
            label="a que edad?" dense outlined></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="3" v-if="
            antecedentesSexuales.tipo_antecedentes_sexuales ==
            'Número de compañeros sexuales'
          ">
          <v-text-field v-model="antecedentesSexuales.cuantos" type="number" min="0" oninput="validity.valid||(value='');"
            label="Cuantos" dense outlined></v-text-field>
        </v-col>

        <v-col cols="12" sm="6" md="3" v-if="
            antecedentesSexuales.tipo_antecedentes_sexuales != 'Espermarquia' &&
            antecedentesSexuales.tipo_antecedentes_sexuales !=
              'Identidad de genero' &&
            antecedentesSexuales.tipo_antecedentes_sexuales !=
              'Orientación sexual' &&
            antecedentesSexuales.tipo_antecedentes_sexuales !=
              'Número de compañeros sexuales' &&
            antecedentesSexuales.tipo_antecedentes_sexuales !=
              'Inicio de relaciones sexuales' &&
            antecedentesSexuales.tipo_antecedentes_sexuales != null
          ">
          <v-autocomplete :items="siNo" label="Si / No " item-text="name" v-model="antecedentesSexuales.resultado" dense
            outlined>
          </v-autocomplete>
        </v-col>

        <v-col cols="12" sm="6" md="2" class="mt-1">
          <v-btn color="boton" block small dark @click="addAntecedente()">Agregar</v-btn>
        </v-col>

        <v-col cols="12" sm="12" md="12">
          <v-alert dense text outlined type="info" color="blue-grey" class="text-center">
            <b>Pre - ingresados</b>
          </v-alert>
          <v-data-table :headers="headers" dense :items="antecedentesPreingresados" class="elevation-1 mt-4"
            hide-default-footer disable-pagination no-data-text="Sin datos para mostrar">
            <template v-slot:[`item.eliminar`]="{ index }">
              <v-btn color="error" icon small @click="antecedentesPreingresados.splice(index, 1)">
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
          <v-alert dense text outlined type="info" color="blue-grey" class="text-center">
            <b>Historico Antecedentes</b>
          </v-alert>
          <v-data-table :headers="headersHistorico" :items="listarAntecedentes" dense hide-default-footer
            disable-pagination no-data-text="Sin datos para mostrar">
            <template v-slot:[`item.actions`]="{ item }">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon color="warning" small class="mr-2" v-bind="attrs" v-on="on" @click="editar(item)">
                    mdi-pencil
                  </v-icon>
                </template>
                <span>Editar</span>
              </v-tooltip>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
  export default {
    name: "WorkspaceJsonAntecedentesComponent",

    data() {
      return {
        loading: false,
        listarAntecedentes: [],
        antecedentesSexuales: {
          tipo_antecedentes_sexuales: null,
          tipo_orientacion_sexual: null,
          tipo_identidad_genero: null,
          resultado: null,
          cuantos: null,
          edad: null,
        },
        tipoOrientacionSexual: [
          "Heterosexual",
          "Homosexual",
          "Bisexual",
          "Pansexual",
          "Asexual",
          "otro",
          "No desea contestar",
        ],
        tipoIdentidadGenero: [
          "Hombre",
          "Mujer",
          "Transgenero",
          "Genero Neutro",
          "Agenero",
          "No desea contestar",
        ],
        siNonoAplica: ["Si", "No", "No aplica"],
        siNo: ["Si", "No"],
        antecedentesPreingresados: [],
        antecedentesT: [{
            name: "Orientación sexual",
          },
          {
            name: "Identidad de genero",
          },
          {
            name: "Espermarquia",
          },
          {
            name: "Inicio de relaciones sexuales",
          },
          {
            name: "Número de compañeros sexuales",
          },
          {
            name: "Activo sexualmente",
          },
          {
            name: "Tiene dificultades durante las relaciones sexuales",
          },
          {
            name: "Usa usted algún metodo anticonceptivo",
          },
          {
            name: "Tiene conocimineto en enfermedades de transmisión sexual",
          },
          {
            name: "Ha sufrido alguna enfermedad de transmision sexual",
          },
          {
            name: "utiliza protección para la prevención de enfermedades de transmision sexual y/o VIH",
          },
          {
            name: "Tiene conocimiento sobre sus derechos sexuales y reproductivos",
          },
          {
            name: "To,a usted decisiones alrededor de su sexualidad y reproducción",
          },
          {
            name: "Ha sido victima de identidad de genero",
          },
          {
            name: "Ha sido victima de violencia contra la mujer y/o violencia de género",
          },
          {
            name: "Ha sido víctima de violencia física y sexual algún momento de su vida",
          },
          {
            name: "Ha sido víctima de mutilación genital",
          },
        ],
        headers: [
          {
            text: "Antecedente",
            value: "tipo_antecedentes_sexuales",
          },
          {
            text: "Tipo orientación sexual",
            value: "tipo_orientacion_sexual",
          },
          {
            text: "Tipo identidad genero",
            value: "tipo_identidad_genero",
          },
          {
            text: "Cuantos",
            value: "cuantos",
          },
          {
            text: "A que edad",
            value: "edad",
          },
          {
            text: "Resultado",
            value: "resultado",
          },
          {
            text: "Eliminar",
            value: "eliminar",
          },
        ],
        fechaRegistro: "",
        headersHistorico: [
          {
            text: "Antecedente",
            value: "tipo_antecedentes_sexuales",
          },
          {
            text: "Tipo orientación sexual",
            value: "tipo_orientacion_sexual",
          },
          {
            text: "Tipo identidad genero",
            value: "tipo_identidad_genero",
          },
          {
            text: "Cuantos",
            value: "cuantos",
          },
          {
            text: "A que edad",
            value: "edad",
          },
          {
            text: "Resultado",
            value: "resultado",
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
        if (this.antecedentesSexuales.tipo_antecedentes_sexuales == null) {
          return this.$toast.error("Debe seleccionar un tipo antecendete");
        }
        if (this.antecedentesSexuales.tipo_antecedentes_sexuales == 'Orientación sexual' && this.antecedentesSexuales.tipo_orientacion_sexual == null) {
          return this.$toast.error("Debe seleccionar un tipo de orientación sexual");
        }
        if (this.antecedentesSexuales.tipo_antecedentes_sexuales == 'Identidad de genero' && this.antecedentesSexuales.tipo_identidad_genero == null) {
          return this.$toast.error("Debe seleccionar un tipo identidad de genero");
        }
        if (this.antecedentesSexuales.tipo_antecedentes_sexuales == 'Número de compañeros sexuales' && this.antecedentesSexuales.cuantos == null) {
          return this.$toast.error("Debe digitar número de compañeros sexuales");
        }
        if (this.antecedentesSexuales.tipo_antecedentes_sexuales == 'Inicio de relaciones sexuales' && this.antecedentesSexuales.edad == null) {
          return this.$toast.error("Debe digitar Inicio de relaciones sexuales");
        }
        if (this.antecedentesSexuales.tipo_antecedentes_sexuales != 'Inicio de relaciones sexuales' &&
            this.antecedentesSexuales.tipo_antecedentes_sexuales != 'Número de compañeros sexuales' &&
            this.antecedentesSexuales.tipo_antecedentes_sexuales != 'Identidad de genero'           &&
            this.antecedentesSexuales.tipo_antecedentes_sexuales != 'Orientación sexual' && this.antecedentesSexuales.resultado == null) {
          return this.$toast.error("Debe seleccionar Si / No / No aplica");
        }

        this.antecedentesPreingresados.push({
          ...this.antecedentesSexuales,
        });
        this.limpiarFiltro();
      },
      guardar() {
        if (this.antecedentesPreingresados[0] == undefined) {
          return this.$toast.error("No hay antecedentes sexuales pre-ingresados para guardar");
        }
        this.$axios
          .post("/antecedentes-sexuales/guardar", this.antecedentesPreingresados)
          .then((res) => {
            this.$toats.success('melos');
            this.limpiarFiltro();
          })
          .catch((err) => {
            console.log("error", err);
          });
      },
      listar() {
        this.$axios
          .get("/antecedentes-sexuales/listar")
          .then((res) => {
            this.listarAntecedentes = res.data;
          })
          .catch((err) => {
            console.error(err);
          });
      },
      limpiarFiltro() {
        for (const prop of Object.getOwnPropertyNames(this.antecedentesSexuales)) {
          this.antecedentesSexuales[prop] = null;
        }
        this.listar();
      },
    },
  };

</script>

<style lang="scss" scoped>
</style>
