<template>
  <div>
    <v-card>
      <v-form>
        <v-card-title class="titulo black--text text-center">Solicitud de capacitación</v-card-title>
        <!-- dialogo de ayuda -->
        <v-dialog v-model="dialogoDiferencias" max-width="800px">
          <template>
            <v-card>
              <div style="text-align:justify">
                <v-alert>
                  <h2 class="text-center">
                    Diferencias entre los tipos de solicitudes
                  </h2>
                  <v-divider class="my-4 info" style="opacity: 0.22"></v-divider>
                </v-alert>
                <v-alert border="left" colored-border color="deep-purple accent-4" elevation="2" text dense
                  icon="mdi-arrow-right">
                  <b>Necesidad:</b> se refiere a aquellas condiciones, recursos o aspectos que son esenciales para que
                  un empleado pueda desempeñar su trabajo de manera efectiva y sentirse satisfecho en su rol dentro de
                  la organización. Estas necesidades están relacionadas con lo que el trabajador considera fundamental
                  para llevar a cabo sus responsabilidades laborales y mantener su bienestar en el ambiente de trabajo.
                </v-alert>
                <v-alert border="left" colored-border color="deep-purple accent-4" elevation="2" text dense
                  icon="mdi-arrow-right">
                  <b>Expectativa:</b> se refiere a las aspiraciones, deseos o demandas que un empleado tiene con
                  respecto a su
                  trabajo, su ambiente laboral y su relación con la organización. Las expectativas son las perspectivas
                  que un trabajador tiene sobre lo que espera recibir o experimentar en su rol dentro de la empresa.
                </v-alert>
                <v-alert border="left" colored-border color="deep-purple accent-4" elevation="2" text dense
                  icon="mdi-arrow-right">
                  <b>Solicitud:</b>
                </v-alert>
              </div>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn small color="boton" dark @click="dialogoDiferencias = false">
                  OK
                </v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
        <v-container>
          <template>
            <div>
              <v-alert type="warning" outlined text dense>
                <v-row align="center">
                  <v-col class="grow">
                    <b>Nota:</b> Si necesitas ayuda para diferenciar los tipos de requerimientos, haz clic en el botón
                    <b>AYUDA</b>
                  </v-col>
                  <v-col class="shrink">
                    <v-btn class="primary" small @click="notaAyuda()">AYUDA</v-btn>
                  </v-col>
                </v-row>
              </v-alert>
            </div>
          </template>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-autocomplete dense v-model="solicitud.tipo_requerimiento" :items="tiposRequerimientosItems"
                label="Tipo de requerimiento" :error-messages="errors.tipo_requerimiento">
              </v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-autocomplete dense v-model="solicitud.fuente" :items="fuentesItems" label="Fuente"
                :error-messages="errors.fuente">
              </v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6" md="4" v-if="solicitud.fuente == 'Otro'">
              <v-text-field dense v-model="solicitud.otro_fuente" label="Defina la fuente"
                hint="Si la fuente es Otro, debe describir la fuente en este campo"
                :error-messages="errors.otro_fuente">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="12">
              <v-textarea auto-grow dense v-model="solicitud.descripcion" label="Descripción de la solicitud"
                hint="Describa con detalle la necesidad de capacitación" :error-messages="errors.descripcion">
              </v-textarea>
            </v-col>
            <v-col cols="12" sm="12" md="12" v-if="$can('solicitudCapacitacion.agregarParticipante')">
              <v-alert class="text-center" text dense color="blue-grey" outlined><b>Relación de empleados</b></v-alert>
              <v-autocomplete outlined dense v-model="solicitud.empleadosSeleccionados" item-text="nombre_completo"
                clearable chips small-chips multiple :items="listaEmpleados" deletable-chips
                label="Relacionar empleados" :error-messages="errors.empleadosSeleccionados">
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-card-actions>
            <v-alert dense text type="info">
              Solicitud a nombre de <b>{{$store.state.auth.datosUsuarioLogueado.nombre_completo}}</b>
            </v-alert>
            <v-spacer></v-spacer>
            <v-btn small color="boton" dark @click="guardarEvento()">
              Realizar solicitud
            </v-btn>
          </v-card-actions>
        </v-container>
      </v-form>
    </v-card>
  </div>
</template>

<script>
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('solicitudCapacitacion.crear')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonSolicitudCapacitacion',

    data() {

      return {
        empleadosSeleccionados: [],
        listaEmpleados: [],
        dialogoDiferencias: false,
        dialogoAgregarParticipante: false,
        tiposRequerimientosItems: ['Expectativa', 'Necesidad', 'Solicitud'],
        fuentesItems: ['Otro'],
        solicitud: {
          tipo_requerimiento: '',
          fuente: '',
          otro_fuente: '',
          descripcion: '',
          usuario_registra_id: '',
          estado_id: '',
        },
        defecto: {
          tipo_requerimiento: '',
          fuente: '',
          otro_fuente: '',
          descripcion: '',
          usuario_registra_id: '',
          estado_id: '',
        },
        errors: {
          tipo_requerimiento: '',
          fuente: '',
          otro_fuente: '',
          descripcion: '',
        },
      };
    },

    mounted() {
      this.listarEmpleados()
    },

    methods: {

      notaAyuda() {
        this.dialogoDiferencias = true
      },

      agregarParticipante() {
        this.dialogoAgregarParticipante = true
      },

      guardarEvento() {
        this.solicitud.usuario_registra_id = this.$store.state.auth.usuario.id
        this.solicitud.estado_id = 10
        this.$axios.post('/solicitudes-capacitaciones/crear', this.solicitud).then(res => {
          this.$toast.success('Solicitud de capacitación registrada exitosamente!.')
          this.solicitud = Object.assign({}, this.defecto)
          this.limpiarError()
          this.datosAfiliado = {}
          this.datosAfiliado = null
          this.documento = null
          return this.$swal({
            type: 'success',
            title: "¡Se ha generado la solicitud de capacitación con éxito!",
            text: 'La solicitud será analizada y posteriormente autorizada o anulada',
          })
        }).catch(error => {
          if (error.response.data.mensaje) {
            this.$toast.error(error.response.data.mensaje)
          } else if (error.response.data) {
            this.ErrorEntrada(error.response.data)
          }
        })
        this.limpiarError()
      },
      ErrorEntrada(errors) {
        for (const key in this.errors) {
          if (key in errors) {
            this.errors[key] = errors[key].join(',')
          }
        }
      },
      limpiarError() {
        for (const key in this.errors) {
          this.errors[key] = ''
        }
      },

      listarEmpleados() {
        this.$axios.get('/empleados/listar').then(res => {
          this.listaEmpleados = res.data.data
        }).catch(error => {
          this.$toast.error(error.response.data.mensaje)
        })
      },
    },
  };

</script>
