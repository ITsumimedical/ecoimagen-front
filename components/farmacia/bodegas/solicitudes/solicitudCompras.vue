<template>
  <div>
    <!-- Preload -->
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

    <v-card>
      <v-col cols="12" sm="12" md="12">
        <v-card flat>
          <form @submit.prevent="agregarArticulo(articulo,cantidad)">
            <v-col cols="12" sm="12" md="12">
              <v-row dense>
                <v-col>
                    <v-alert text dense color="blue-grey" border="bottom" class="text-center" icon="mdi-cash-multiple"><b>SOLICITUD DE COMPRAS</b></v-alert>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-autocomplete @change="listarMedicamentosBodega" v-model="formSolicitudCompras.bodega_origen_id"
                    label="Bodega Solicitante*" :items="listaBodegas" item-text="nombre" item-value="id" dense outlined required>
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" md="10" v-if="formSolicitudCompras.bodega_origen_id">
                  <v-autocomplete v-model="articulo" :loading="preloadArticulos" label="Articulo*" :items="listaMedicamentos"
                    :item-text="listaMedicamentos => listaMedicamentos.invima?listaMedicamentos.codesumi.codigo+' (' + listaMedicamentos.codesumi.nombre+' - '+listaMedicamentos.invima.titular+' - '+listaMedicamentos.invima.expediente+')':listaMedicamentos.codesumi.codigo+' (' + listaMedicamentos.codesumi.nombre+' - '+')'"
                    return-object required dense outlined></v-autocomplete>
                </v-col>
                <v-col cols="12" md="2" v-if="formSolicitudCompras.bodega_origen_id">
                  <v-text-field v-model="cantidad" label="Cantidad*" type="number" dense outlined required></v-text-field>
                </v-col>
              </v-row>
            </v-col>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn small color="primary" type="submit">Agregar</v-btn>
              <v-btn small color="success" @click="dialogoCargue = true">Cargar solicitud masiva</v-btn>
            </v-card-actions>
          </form>
          <v-row>
            <v-col cols="12" md="12">
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-center">#</th>
                      <th class="text-center">Codigo</th>
                      <th class="text-center">Medicamento</th>
                      <th class="text-center">Presentacion</th>
                      <th class="text-center">Cantidad</th>
                      <th class="text-center"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item,index) in listaArticulosAgregados" :key="item.id">
                      <td class="text-center">{{ index+1 }}</td>
                      <td class="text-center">
                        {{ item.articulo.invima == null?'SIN EXPEDIENTE':item.articulo.invima.cum_validacion}}</td>
                      <td class="text-center">{{ item.articulo.codesumi.nombre}}</td>
                      <td class="text-center">
                        {{ item.articulo.invima == null?'SIN EXPEDIENTE':item.articulo.invima.titular}}</td>
                      <td class="text-center">{{ item.cantidad_inicial}}</td>
                      <td class="text-center">
                        <v-btn class="mx-2" fab dark small color="error" @click="eliminarArticulo(index)">
                          <v-icon dark>mdi-close</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
            <v-col cols="12" md="12">
              <v-btn v-if="listaArticulosAgregados.length > 0" block color="success" @click="enviarSolicitud">Enviar
                Solicitud</v-btn>
            </v-col>
          </v-row>
          <v-dialog max-width="800px" persistent v-model="dialogoCargue">
            <v-card>
             <v-alert text dense color="blue-grey" icon="mdi-download" border="bottom" class="text-center">
                <b>Cargar compras masivamente</b>
             </v-alert>
             <v-col cols="12" sm="12" md="12">
                                <v-alert text dense border="left" color="blue-grey" icon="mdi-information-box-outline">
                                    <b>IMPORTANTE:</b> Es indispensable utilizar el formato
                                    proporcionado para garantizar la correcta carga de datos. Puede
                                    descargar el formato
                                    <b style="cursor: pointer;text-decoration: underline;color: blue;"
                                        @click="descargarFormato()">aquí</b>.
                                </v-alert>
                            </v-col>
             <v-form ref="cargaMasivaForm">
              <v-card-text>
                <v-col cols="12" sm="12" md="12">
                  <v-row>
                    <v-col cols="12" sm="12" md="2">
                      <v-btn small color="success" @click="importarExcel()">
                        <v-icon>mdi-attachment</v-icon>
                      </v-btn>
                    </v-col>
                    <input type="file" v-show="false" ref="file" @change="onFilePicked">
                    <v-col cols="12" sm="12" md="10">
                      <v-text-field label="Nombre Excel" v-model="nombreArchivo" readonly :rules="excelRequerido">
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
              </v-card-text>
            </v-form>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn small color="error" @click="limpiarDialogoCargue()">
                  Cancelar
                </v-btn>
                <v-btn small color="success" @click="validarExcel()" :loading="loadingCargue">
                  Realizar cargue
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card>
      </v-col>
    </v-card>

  </div>
</template>
<script>
import { mapActions } from "vuex";
  import {
    listarBodegas
  } from "~/api/bodegas/bodegas";
  import {
    listarMedicamentosBodega
  } from "~/api/medicamentos/medicamento";
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('farmacia.movimientos')) {
        return redirect('/');
      }
    },
    name: "solicitudCompras",
    props: ["tipo"],
    mounted() {
      this.listarBodegas();
      // this.listarMedicamentosBodega();
    },
    data: () => ({
      listaBodegas: [],
      listaArticulosAgregados: [],
      listaMedicamentos: [],
      articulo: null,
      preload: false,
      preloadArticulos: false,
      cantidad: null,
      loadingCargue: false,
      excelRequerido: [
        v => !!v || 'Este campo es requerido',
      ],
      formSolicitudCompras: {
        bodega_origen_id: null,
      },
      dialogoCargue: false,
      nombreArchivo: '',
      excels: {},
    }),
    methods: {
      ...mapActions('app', ['setPreload']),

      listarBodegas() {
        // this.preload = true;
        this.$axios.get('/bodegas/listarBodegasAsociadas').then(res => {
          this.listaBodegas = res.data;
        }).catch(e => {
          console.log(e.response)
        })
      },
      listarMedicamentosBodega() {
        this.preloadArticulos = true
        const request = {
          bodega:this.formSolicitudCompras.bodega_origen_id
        }
        this.$axios.post('/medicamentos/listarMedicamentoBodega', request).then(res => {
          this.preloadArticulos = false
          this.listaMedicamentos = res.data;
          console.log('dks', this.listaMedicamentos)
        }).catch(e => {
          console.log(e.response);
          this.preloadArticulos = false;
        })
      },
      async agregarArticulo(articulo, cantidad) {
        const data = {
          articulo: articulo,
          medicamento_id: articulo.medicamento_id,
          cantidad_inicial: cantidad
        }
        if (parseInt(this.cantidad) <= 0) {
          return this.$swal(
            'Valor incorrecto!',
            'El Campo "Cantidad" debe tener un valor mayor a 0',
            'error'
          )
        }
        this.listaArticulosAgregados.push(data)

        this.cantidad = null;
        this.articulo = null;
      },

      eliminarArticulo(id) {
        this.listaArticulosAgregados.splice(id, 1);
      },
      limpiarFormularios() {
        this.articulo = null;
        this.cantidad = null;
        this.listaArticulosAgregados = [];
      },
      enviarSolicitud() {

        this.$swal({
          title: 'Esta Seguro?',
          text: "Generar Solicitud de Compras",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#28a745',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Guardar'
        }).then((result) => {
          if (result.value) {
            this.preload = true;
            let form = this.formSolicitudCompras;
            form.tipo_solicitud_bodega_id = this.tipo;
            form.bodega_destino_id = form.bodega_origen_id;
            form.articulos = this.listaArticulosAgregados;
            this.$axios.post('/solicitud-bodegas/crearSolicitudCompra', form).then(res => {
              this.articulo = null;
              this.cantidad = null;
              this.preload = false;
              this.listaArticulosAgregados = [];
              this.formSolicitudCompras.bodega_origen_id = null;
              this.$swal({
                title: 'Solicitud de Compra',
                text: 'Se ha registrado la solicitud con id:' + ' ' + res.data,
                type: 'info',
                showCancelButton: false,
                cancelButtonColor: '#d33',
              })
              let pdf = {
                tipo: "ordenCompra",
                id: res.data
              };
              this.imprimir(pdf);
            }).catch(error => {
              this.preload = false;
              this.$toast.error(error.response.mensaje);
            });
          }
        })
      },

      imprimir($pdf) {
        console.log('xd', $pdf);
        this.$axios.post('pdf', $pdf, {
          responseType: "arraybuffer"
        }).then(res => {
          let blob = new Blob([res.data], {
            type: "application/pdf"
          });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          window.open(link.href, "_blank");
        });
      },

      importarExcel() {
        this.nombreArchivo = ''
        this.$refs.file.value = null
        this.$refs.file.click()
      },

      onFilePicked(e) {
        let ex = e.target.files
        this.nombreArchivo = ex[0].name
        this.excels.file = ex[0]
      },

      validarExcel() {
        if(!this.$refs.cargaMasivaForm.validate()) {
            return this.$toast.error('Campos requeridos')
        }
        this.loadingCargue = true;
        this.listaArticulosAgregados = []
        let formData = new FormData();
        formData.append('archivo', this.excels.file);
        this.$axios.post('solicitud-bodegas/carga-masiva-compras', formData).then(res => {
            if(res.data.archivo_url) {
                this.$swal({
                    title: "Error al cargar el archivo",
                    text: "El archivo cargado contiene errores, revisa el archivo de errores descargado y vuelve a realizar la carga masiva",
                    type: "error",
                });
                 this.descargarArchivo(res.data.archivo_url);
                 setTimeout(() => {
                    this.eliminarArchivoGenerado(res.data.archivo_url);
                 }, 5000)
                 return;
            }
            this.$swal({
            title: "Archivo cargado con éxito",
            text: `El número de su solicitud es ${res.data.solicitud_id}`,
            type: "success",
            });
            let pdf = {
                tipo: "ordenCompra",
                id: res.data.solicitud_id
              };
              this.imprimir(pdf);
            this.limpiarDialogoCargue();
        }).catch(e => {
            this.$toast.error(e.response.data.error)
        }).finally(() => {
            this.loadingCargue = false
        })
      },
      descargarArchivo(url) {
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', url.split('/').pop());
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
      limpiarDialogoCargue() {
        this.dialogoCargue = false,
        this.$refs.cargaMasivaForm.resetValidation();
        this.nombreArchivo = null
      },
      eliminarArchivoGenerado(ruta) {
        let nombreArchivo = ruta.split('/').pop();
        this.$axios.delete('solicitud-bodegas/eliminar-archivo-cargue-solicitudes', { data: { nombreArchivo } }).then((res) => {
            console.log('eliminado con éxito')
        }).catch((error) => {
            console.log(error.response.data.error)
        })
      },
      async descargarFormato() {
            try {
                const data = {
                    nombre_archivo: 'plantillaCargueMasivoCompras.xlsx',
                    nombre_carpeta: 'adjuntosFarmacia/solicitudCompras',
                    tiempo: 5
                };

                this.setPreload(true);

                const response = await this.$axios.post('adjuntos/generar-url-descarga-s3', data);
                window.open(response.data, "_blank");

            } catch (error) {
                this.$toast.error('Ocurrió un error al descargar el formato');
            } finally {
                this.setPreload(false);
            }
        }
    }
  }

</script>
