<template>
  <div>
    <v-card>
      <v-form>
        <v-card-title class="titulo">
          <span class="black--text text-h5">Reporte de incidentes relacionados con las funciones del empleado</span>
        </v-card-title>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <v-text-field dense v-model="incidente.fecha_incidente" :error-messages="errors.fecha_incidente"
                label="Fecha ocurrencia incidente" type="date">
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-autocomplete :items="listaEmpleados" :item-text="concatenar" item-value="id"
                v-model="incidente.empleado_id" label="Relación de empleado" dense :error-messages="errors.empleado_id">
              </v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-autocomplete dense v-model="incidente.gravedad" :error-messages="errors.gravedad"
                :items="gravedadesItems" label="Gravedad del incidente">
              </v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-autocomplete dense v-model="incidente.periodicidad_seguimiento"
                :error-messages="errors.periodicidad_seguimiento" :items="periodicidadesItems"
                label="Periodicidad de seguimiento">
              </v-autocomplete>
            </v-col>
            <v-col cols="12" sm="12" md="12">
              <v-textarea auto-grow dense v-model="incidente.descripcion" label="Descripción del incidente"
                :error-messages="errors.descripcion">
              </v-textarea>
            </v-col>
            <v-col cols="12" sm="12" md="12">
              <v-textarea auto-grow dense v-model="incidente.comentarios" label="Comentarios adicionales al reporte"
                :error-messages="errors.comentarios">
              </v-textarea>
            </v-col>
          </v-row>
          <v-card-text>
            <v-alert dense text type="info">
              Reporte a nombre de {{$store.state.auth.datosUsuarioLogueado.nombre_completo}}
            </v-alert>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="boton" small dark @click="guardarIncidente()">
              Guardar
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
      if (!$can('incidente.listar')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonincidentes',

    data() {
      return {
        listaEmpleados: [],
        periodicidadesItems: ['Mensual', 'Bimestral', 'Trimestral', 'No aplica'],
        gravedadesItems: ['Leve', 'Moderada', 'Grave'],
        incidente: {
          estado_id: 10,
          fecha_incidente: null,
          descripcion: null,
          empleado_id: null,
          comentarios: null,
          periodicidad_seguimiento: null,
          gravedad: null,
        },
        defecto: {
          estado_id: 10,
          fecha_incidente: null,
          descripcion: null,
          empleado_id: null,
          comentarios: null,
          periodicidad_seguimiento: null,
          gravedad: null,
        },
        errors: {
          fecha_incidente: null,
          descripcion: null,
          empleado_id: null,
          comentarios: null,
          periodicidad_seguimiento: null,
          gravedad: null,
        },
      };
    },

    mounted() {
      this.listarEmpleados()
    },

    methods: {
      listarEmpleados() {
        this.$axios.get('/empleados/listar').then(res => {
          this.listaEmpleados = res.data.data
        }).catch(error => {
          this.$toast.error(error.response.data.mensaje)
        })
      },
      concatenar(listarEmpleados) {
        return `${listarEmpleados.documento} - ${listarEmpleados.nombre_completo}`;
      },
      guardarIncidente() {
        this.incidente.usuario_reporta_id = this.$store.state.auth.usuario.id
        this.$axios.post('/incidentes/crear', this.incidente).then(res => {
          this.$toast.success('Incidente registrado exitosamente!.')
          this.incidente = Object.assign({}, this.defecto)
          this.limpiarError()
          return this.$swal({
            type: 'success',
            title: "¡Se ha generado un reporte de incidente con éxito!",
            text: 'Ahora puede realizar seguimiento individual al caso registrado',
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
    },
  };

</script>
