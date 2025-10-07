<template>
  <div>
    <v-container fluid v-if="validation">
      <v-row class="justify-center">
        <v-col cols="12" sm="12" md="12">
          <form @submit.prevent="submit">
            <v-card :disabled="preload" :loading="preload">
              <v-card-title class="titulo white--text">
                <span>Reporte PQRSF</span>
                <v-spacer></v-spacer>
              </v-card-title>
              <v-card-text>
                <v-text-field color="titulo" prepend-icon="mdi-magnify" v-model="cedula" label="Cédula del afiliado"
                  type="number">
                </v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="boton" dark type="submit">Reportar</v-btn>
              </v-card-actions>
            </v-card>
          </form>
        </v-col>
      </v-row>
    </v-container>

    <!-- Formulario -->
    <v-card :loading="preload" :disabled="preload">
      <component :is="componente" :datos="dato" @respuestaComponente="componente = null" />
    </v-card>


    <v-dialog v-model="dialogHistory" width="700" persistent>
      <v-card>

        <v-card-title class="headline primary" style="color:white" primary-title>
          Historial
        </v-card-title>

        <v-card-text>
          <v-layout>
            <v-expansion-panel>
              <v-expansion-panel-content v-for="(item, index) in history" :key="index">
                <template v-slot:header>
                  <span><b># Radicado:</b> {{item.id}}</span>
                  <span><b>Estado:</b>
                    <v-chip :class="ColorTd(item.estado)">{{item.estado}}</v-chip>
                  </span>
                  <span><b>Fecha:</b> {{item.created_at.split('.')[0]}}</span>
                </template>
                <v-card>
                  <v-container grid-list-md>
                    <v-layout row wrap>
                      <v-flex xs6 md6>
                        <v-text-field label="Tipo de Solicitud" v-model="item.Tiposolicitud" readonly></v-text-field>
                      </v-flex>
                      <v-flex xs6 md6>
                        <v-text-field label="Canal" v-model="item.Canal" readonly>
                        </v-text-field>
                      </v-flex>
                      <v-flex xs12 md12>
                        <v-textarea readonly outlined label="Descripción" :value="item.Descripcion">
                        </v-textarea>
                      </v-flex>
                      <v-flex xs12 md12 v-if="item.gestion_pqrsfs.length > 0">
                        <span> <strong>Nombre:</strong> {{ item.gestion_pqrsfs[0]['name'] }}
                          {{ item.gestion_pqrsfs[0]['apellido'] }}</span>
                      </v-flex>
                      <v-flex xs12 md12 v-else>
                        <span> <strong>usuario:</strong> {{ usuario.Primer_Nom }}
                          {{ usuario.Primer_Ape }}</span>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-layout>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" flat @click="dialogHistory = false, validation = false, infoAviso()">
            ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>

</template>
<script>
  import {
    buscarAfiliado,
  } from '@/api/afiliados/afiliados'
  import FormPqrfsComponent from '~/components/pqrsf/FormPqrfsComponente.vue';

  export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
    name: 'PqrsfFormulario',
    components: {
        FormPqrfsComponent
    },

    data() {
      return {
        cedula: '',
        componente: null,
        dato: {},
        usuario: {},
        quienGenero: '',
        tipoSolicitud: '',
        descripcion: '',
        maxDescripcion: [
          v => v.length <= 240 || 'Maximo de caracteres 240',
        ],
        checkbox: false,
        email: '',
        supersalud: '',
        cedulaGenero: '',
        nombreGenero: '',
        adjuntos: [],
        canal: '',
        validation: true,
        history: [],
        dialogHistory: false,
        preload: false
      }
    },
    methods: {
      submit() {
        this.validacionPaciente();
      },

      async validacionPaciente() {
        if (this.cedula == "") {
          this.$swal({
            type: 'error',
            title: "¡No puede ser!",
            text: 'Debe escribir un numero de documento!',
          })
          return
        }
        this.preload = true;
        try {
          const {
            data
          } = await this.$loadingGetRequest(buscarAfiliado(this.cedula))
          console.log(data.data)
          this.usuario = data
          this.usuario.estado_afiliacion = data.estado_afiliado.nombre
          this.usuario.tipo_afiliado = data.tipo_afiliado.nombre
          this.infoAviso();
          this.validation = false
          this.preload = false
          this.componente = 'FormPqrfsComponent'
        } catch (error) {
          if (error.response.data.mensaje) {
            this.$toast.error(error.response.data.mensaje)
          } else if (error.response.data) {
            this.ErrorEntrada(error.response.data)
          }
        }
      },
      infoAviso() {
        this.$swal({
          title: 'Aviso',
          text: 'Señor usuario recuerde que para recibir respuesta a su solicitud debe ingresar un correo electrónico valido de lo contrario deberá realizar su tramite a través de los canales presenciales. Se recuerda la importancia que de manera continua actualice sus datos personales en su sede de atención primaria.',
          type: 'info',
          allowOutsideClick: false
        })
      },
      showError: (message) => {
        Swal.fire({
          icon: 'warning',
          title: "¡No puede ser!",
          text: `${message}`,
        })
      },
      enviarFormulario() {
        if (this.checkbox == false) {
          swal({
            title: "¡Debe aceptar el uso de sus datos personales según Ley 1581 de 2012!",
            text: ` `,
            timer: 2000,
            icon: "error",
            buttons: false
          });
          return
        }
        if (this.quienGenero == 'Otro') {
          if ((this.cedulaGenero == '') || (this.nombreGenero == '')) {
            swal({
              title: "¡Debe ingresar los campos obligatorios!",
              text: ` `,
              timer: 2000,
              icon: "error",
              buttons: false
            });
            return
          }
        }
        this.adjuntos = this.$refs.adjuntos.files
        if (this.adjuntos.length > 3) {
          swal({
            title: "¡No puede adjuntar más de 3 archivos!",
            text: ` `,
            timer: 2000,
            icon: "error",
            buttons: false
          });
          return
        }
        let formData = new FormData();
        formData.append('paciente_id', this.paciente.id)
        formData.append('documento', this.paciente.Num_Doc)
        formData.append('telefono', this.paciente.Telefono)
        formData.append('email', this.email)
        formData.append('supersalud', this.supersalud)
        formData.append('quiengenero', this.quienGenero)
        formData.append('cedulagenero', this.cedulaGenero)
        formData.append('nombregenero', this.nombreGenero)
        formData.append('tiposolicitud', this.tipoSolicitud)
        formData.append('descripcion', this.descripcion)
        formData.append('canal', this.canal)
        for (let i = 0; i < this.adjuntos.length; i++) {
          formData.append(`adjuntos[]`, this.adjuntos[i]);
        }
        axios.post(`/api/pqrsf/storeuser`, formData)
          .then(res => {
            this.data = res.data
            this.limpiarFormulario()
            Swal.fire({
              title: 'Exito!',
              text: `Sr(a) ${this.paciente.Primer_Nom} su solicitud fue radicada con éxito N° de radicado ${this.data.pqrsf}
                            La respuesta será enviada a su correo electrónico dando cumplimiento a los tiempos de oportunidad establecidos
                            por Fiduprevisora SA`,
              icon: 'success',
              allowOutsideClick: false
            })
          }).catch(err => {
            let msg = '';
            for (const pro in err.response.data) {
              if (msg) msg += `${err.response.data[pro]}`
              else msg = err.response.data[pro]
            }
            swal({
              title: msg,
              text: " ",
              type: "error",
              icon: "error",
            });
          })
      },
      limpiarFormulario() {
        this.email = ''
        this.supersalud = ''
        this.quienGenero = ''
        this.cedulaGenero = ''
        this.nombreGenero = ''
        this.tipoSolicitud = ''
        this.descripcion = ''
        this.$refs.adjuntos.value = ''
        this.canal = ''
        this.checkbox = false
      },
      ColorTd(estado) {
        if (estado == 'Cerrado') {
          return 'error white--text';
        } else {
          return 'success white--text';
        }
      }
    }
  }

</script>
