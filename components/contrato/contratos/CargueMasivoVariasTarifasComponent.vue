<template>
  <div>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon small color="warning" v-bind="attrs" v-on="on" @click="dialog = true">
          <v-icon>
            mdi-upload
          </v-icon>
        </v-btn>
      </template>
      <span>Cargue masivo a tarifas</span>
    </v-tooltip>

    <v-dialog v-model="dialog" width="600">
      <v-card>
        <v-card-title>
          Cargue masivo de codigos a multiples tarifas
        </v-card-title>

        <v-card-text v-if="errores.length > 0">
          <v-alert color="red" outlined prominent type="error">
            <ul>
              <li v-for="(error, index) in errores" :key="index">{{ error }}</li>
            </ul>
          </v-alert>
        </v-card-text>

        <v-card-text>
          <v-form ref="form" @submit.prevent="submit">
            <v-row>
              <v-col cols="12">
                <v-file-input v-model="form.file" label="Click para adjuntar archivo" dense outlined show-size
                  truncate-length="25"></v-file-input>
              </v-col>
              <v-col cols="12">
                <div class="d-flex justify-center align-center">
                  <v-btn type="submit" color="success" class="mr-2">Cargar</v-btn>
                  <v-btn @click="plantilla" color="warning">Plantilla</v-btn>
                </div>
              </v-col>

            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import {
    mapActions
  } from 'vuex';
  import {
    descargarArchivoEnBase64
  } from '@/utils/descargaDeArchivos';

  export default {
    props: {
      tarifa_id: {
        type: Number,
        default: null,
      },
    },

    data() {
      return {
        data: null,
        dialog: false, // Controla el estado del diálogo
        form: {
          file: null,
        },
        errores: [],
      };
    },

    watch: {
      dialog(valor) {
        if (!valor) {
          this.errores = [];
        }
      },
    },

    methods: {
      ...mapActions('app', ['setPreload']),

      async submit() {
        this.errores = [];

        try {
          if (!this.form.file) {
            return;
          }

          const request = new FormData();
          request.append('file', this.form.file);

          this.setPreload(true);
          const response = await this.$axios.post(
            'tarifa/carga-masiva-multiple',
            request, {
              headers: {
                'Content-Type': 'multipart/form-data',
              }
            }
          );
          this.$toast.success('Las tarifas se cargaron con éxito');
          this.dialog = false;
          this.$emit('cerrar');
        } catch (error) {
          this.$toast.error('Se encontraron algunos errores. Los CUPS sin errores se cargaron con éxito');
          const data = error.response.data;
          descargarArchivoEnBase64(data.excel.archivo, data.excel.nombre, data.excel.extension);
          this.dialog = false;
          this.$emit('cerrar');
        } finally {
          this.setPreload(false);
          this.limpiar();
        }
      },

      plantilla(){
        this.setPreload(true);
        this.$axios.get("/tarifa/descargarPlantillaTarifas", {
            responseType: 'blob',
          }).then(res => {
            this.setPreload(false);
            let blob = new Blob([res.data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
            });
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.download = 'PlantillaCargueMultiplesTarifas.xlsx';
            a.href = url;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          })
          .catch((error) => {
            this.setPreload(false);
            this.$toast.error(error.response.data.mensaje);
          });
      },

      limpiar() {
        this.form.file = null;
        this.errores = [];
      }
    }
  };

</script>
