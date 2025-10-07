<template>

    <v-dialog v-model="dialog" width="1000">
  
      <template v-slot:activator="{ on, attrs }">
        <v-btn small color="primary" v-bind="attrs" v-on="on">
          <v-icon dark right>
            mdi-upload
          </v-icon>
          Cargue Masivo Codigos Propios
        </v-btn>
      </template>
  
      <v-card>
        <v-card-title>
          Cargue masivo de codigos propios
        </v-card-title>
  
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-alert text dense border="left" color="blue-grey lighten-1" icon="mdi-information-box-outline">
                <b>IMPORTANTE:</b>
                <ul class="pl-4 mt-2">
                  <!-- Ambito -->
                  <li>En el campo <b>ambito_id</b>, debe colocar el número correspondiente a la opción deseada:
                    <ul class="pl-4 mt-2">
                      <li><b>1</b> - Ambulatorio</li>
                      <li><b>2</b> - Hospitalario</li>
                      <li><b>3</b> - Ambulatorio/Hospitalario</li>
                    </ul>
                  </li>
  
                  <!-- Género -->
                  <li class="mt-3">En el campo <b>genero</b>, debe colocar la letra correspondiente a la opción deseada:
                    <ul class="pl-4 mt-2">
                      <li><b>A</b> - Ambos</li>
                      <li><b>F</b> - Femenino</li>
                      <li><b>M</b> - Masculino</li>
                    </ul>
                  </li>
  
                  <!-- Edad -->
                  <li class="mt-3">En los campos <b>Edad Inicial</b> y <b>Edad Final</b>, debe colocar el número de las
                    edades entre las cuales será permitido el uso de ese código.</li>
  
                  <!-- Periodicidad -->
                  <li class="mt-3">En el campo <b>Periodicidad</b>, debe colocar el número que represente la cantidad
                    permitida de cada cuánto se puede ordenar el código propio.</li>
  
                  <!-- Quirúrgico, Diagnóstico Requerido, Requiere Auditoría -->
                  <li class="mt-3">En los campos <b>quirúrgico</b>, <b>diagnóstico requerido</b> y <b>requiere
                      auditoría</b>, debe colocar el número correspondiente a la opción deseada:
                    <ul class="pl-4 mt-2">
                      <li><b>0</b> - No</li>
                      <li><b>1</b> - Sí</li>
                    </ul>
                  </li>
                </ul>
              </v-alert>
            </v-col>
          </v-row>
  
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
          dialog: false,
          form: {
            file: null
          },
          errores: []
        }
      },
  
      watch: {
        dialog(valor) {
          if (!valor) {
            this.errores = []
          }
        }
      },
  
      methods: {
        ...mapActions('app', ['setPreload']),
  
        async submit() {
          // Limpiamos los errores previos
  
          try {
            // Verificar si no hay archivo seleccionado
            if (!this.form.file) {
              this.$toast.error('Por favor, seleccione un archivo antes de continuar.');
              return;
            }
  
            // Crear el objeto FormData para enviar el archivo
            const request = new FormData();
            request.append('file', this.form.file);
  
            // Iniciar el cargue y mostrar el preloader
            this.setPreload(true);
  
            // Realizar la petición POST al backend
            const response = await this.$axios.post('codigo-propio/carga-masiva', request, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
  
            // Mostrar mensaje de éxito y cerrar el diálogo
            this.$toast.success('Los códigos propios se cargaron con éxito');
            this.dialog = false;
  
          } catch (error) {
            // Verificar que la respuesta contiene datos
            const data = error.response && error.response.data;
            // Si hay errores específicos y un archivo Excel de errores
            if (data && data.excel) {
              // En caso de error, mostrar mensaje general
              this.$toast.error(
                'Se encontraron algunos errores. Los códigos que no tuvieron errores se cargaron con éxito.');
              // Descargamos el archivo con los códigos que tuvieron errores
              descargarArchivoEnBase64(data.excel.archivo, data.excel.nombre, data.excel.extension);
            }
  
            // Si hay mensajes de error específicos, los agregamos al componente
            if (data && data.mensaje) {
              this.$toast.error(data.mensaje);
            }
          } finally {
            // Desactivar el preloader y limpiar el formulario
            this.setPreload(false);
            this.limpiar
            this.$emit('cerrar');
          }
        },
  
        handleClick() {
          this.$refs.file.click()
        },
  
        plantilla() {
          this.setPreload(true);
          this.$axios.get("/codigo-propio/descargarPlantillaCodigoPropio", {
              responseType: 'blob',
            }).then(res => {
              this.setPreload(false);
              let blob = new Blob([res.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
              });
              let url = window.URL.createObjectURL(blob);
              let a = document.createElement('a');
              a.download = 'PlantillaCargueCodigosPropios.xlsx';
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
          this.form.file = null,
            this.errores = []
        }
  
      }
  
    }
  
  </script>
  