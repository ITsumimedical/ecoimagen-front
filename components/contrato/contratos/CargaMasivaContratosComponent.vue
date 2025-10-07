<template>

  <v-dialog v-model="dialog" width="600">

      <template v-slot:activator="{ on, attrs }">
          <v-btn small color="primary" v-bind="attrs" v-on="on">
              <v-icon dark right>
                  mdi-upload
              </v-icon>
              Cargue masivo
          </v-btn>
      </template>

      <v-card>
          <v-card-title>
              Cargue masivo de contratos
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
                          <v-file-input v-model="form.file" label="Click para adjuntar archivo" dense outlined
                              show-size truncate-length="25"></v-file-input>
                      </v-col>
                      <v-col cols="12">
                          <v-btn type="submit" block color="success">Cargar</v-btn>
                      </v-col>
                  </v-row>
              </v-form>
          </v-card-text>
      </v-card>
  </v-dialog>

</template>
<script>
import { mapActions } from 'vuex';
import { descargarArchivoEnBase64 } from '@/utils/descargaDeArchivos';
export default {

  data() {
      return {
          dialog: false,
          form: {
              file: null
          },
          errores: []
      }
  },

  watch: {
      dialog(valor){
          if(!valor){
              this.errores = []
          }
      }
  },

  methods: {
      ...mapActions('app', ['setPreload']),

      async submit() {

          // limpiamos los errores
          this.errores = [];

          try {
              if (!this.form.file) {
                  return
              }

              const request = new FormData()
              request.append('file', this.form.file)

              this.setPreload(true)
              const response = await this.$axios.post('contrato/carga-masiva', request, {
                  headers: {
                      'Content-Type': 'multipart/form-data',
                  },
              })
              this.$toast.success('Los contratos se cargaron con exito');
          } catch (error) {
              this.$toast.error('hubo algunos contratos con errores, los contratos que no tuvieron errores fueron cargados con exito.')
              // descargamos el archivo
              const data = error.response.data
              descargarArchivoEnBase64(data.excel.archivo, data.excel.nombre, data.excel.extension)
          } finally {
              this.setPreload(false)
              //this.limpiar()
          }
      },

      handleClick() {
          this.$refs.file.click()
          console.log('dieron click');
      },

      pintarErrores(errores) {
          //si es un objeto es por que vienen multiples errores
          if (typeof errores === 'object') {
              // ... aqui parcho un reduce
          }

          // si es un string asigno directamente el campo al array es decir lo agrego
          if (typeof errores === 'string') {
              this.errores.push(errores)
          }

      },

      limpiar() {
          this.form.file = null,
          this.errores = []
      }

  }

}

</script>