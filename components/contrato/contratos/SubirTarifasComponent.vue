<template>
  <div>
    <v-card :loading="loading">

      <v-card-title>
        <span class="headline">Importar archivo</span>
      </v-card-title>

      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap align-center>

            <v-col col="12" sm="6" md="3">
              <v-text-field v-model="importContrato.contrato_id" readonly label="id contrato">
              </v-text-field>
            </v-col>

            <v-col col="12" sm="6" md="9">
              <v-text-field v-model="importContrato.entidad" readonly label="Entidad">
              </v-text-field>
            </v-col>

            <v-col col="12" sm="6" md="6">
              <v-text-field v-model="importContrato.manual" readonly label="Manual">
              </v-text-field>
            </v-col>

            <v-col col="12" sm="6" md="6">
              <v-text-field v-if="importContrato.tarifa == 0" readonly label="Tarifa" value="Pleno">
              </v-text-field>
              <v-text-field v-else readonly label="Tarifa" v-model="importContrato.tarifa">
              </v-text-field>
            </v-col>

            <v-col col="3" sm="12" md="12">
              <v-file-input v-model="file" @change="manejoError" show-size accept=".xlsx"
              label="Selecccione el archivo">

              <template v-slot:selection="{ text }">

                <v-chip small label color="primary">
                  {{ text }}
                </v-chip>

              </template>

            </v-file-input>

            <v-alert v-if="errorMessage" type="error">{{ errorMessage }}</v-alert>
            </v-col>

          </v-layout>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" :disabled="loading" dark @click="limpiar()">Cancelar</v-btn>
        <v-btn color="boton" :disabled="loading" dark @click="saveFile()">Guardar</v-btn>
      </v-card-actions>

    </v-card>
  </div>
</template>

<script>
export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
  name: "subirTarifas",
  data() {
    return {
      file: null,
      importContrato: {},
      loading: false,
      errorMessage: null,

    }
  },

  props: ['contrato'],

  mounted() {
    this.importContrato = {
      contrato_id: this.contrato.id,
      entidad: this.contrato.entidad.nombre,
      manual: this.contrato.tipo_manual.nombre,
      tarifa: this.contrato.tarifa == null ? 0 : this.contrato.tarifa
    };
  },

  methods: {

    saveFile() {
      this.manejoError()
      if (!this.file) {
          this.$toast.error("El archivo de carga es requerido");
          return;
        }
      this.loading = true
      let formData = new FormData();
      formData.append('file', this.file);
      this.$axios.post('/contrato/importTarifa/' + this.importContrato.contrato_id,
        formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((res) => {
        this.loading = false
        this.manejoError()
        this.$alerSuccess('Tarifas masivas cargadas con exito!');

      }).catch((error) => {
        this.loading = false
        this.errorMessage = error.response.data.mensaje;
      });
    },

    limpiar() {
      this.$emit('cerrar')
      this.file = null;
    },

    manejoError() {
      this.errorMessage = '';
    },
  }
}

</script>

<style></style>
