<template>
  <div>
    <template>
      <v-dialog v-model="preload" persistent width="300">
        <v-card color="primary" dark>
          <v-card-text>
            Procesando Información
            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
    </template>
    <v-card elevation="0">
      <v-container fluid>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-alert border="left" class="text-center" dense text type="info" icon="mdi-hospital-building">
            <b>ANTECEDENTES HOSPITALARIOS</b></v-alert>
          <v-row dense>
            <v-col cols="12" sm="6" md="6">
              <v-autocomplete label="¿Ha tenido hospitalizaciones en el ultimo año?" dense outlined
                :items="['Si', 'No']" v-model="antecedentesHospitalarios.hospitalizacion_ultimo_anio" :rules="rules">
              </v-autocomplete>
            </v-col>
            <template v-if="antecedentesHospitalarios.hospitalizacion_ultimo_anio == 'Si'">
              <v-col cols="12" sm="6" md="6">
                <v-text-field label="¿Cuantas hospitalaciones ha tenido en el último año?" type="number" dense outlined
                  v-model="antecedentesHospitalarios.cantidad_hospitalizaciones" :rules="rules"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field label="Fecha de la última hospitalización" dense outlined type="date" :max="fechaMimina"
                  v-model="antecedentesHospitalarios.fecha_ultimas_hospitalizaciones" :rules="rules">
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-textarea label="Descripción" dense outlined :rules="rules"
                  v-model="antecedentesHospitalarios.descripcion_hospiurg"></v-textarea>
              </v-col>
            </template>
            <v-col cols="12" sm="6" md="6">
              <v-autocomplete label="¿Ha tenido Hospitalazión en UCI en este año?" :items="['Si', 'No']" dense outlined
                v-model="antecedentesHospitalarios.hospitalizacion_uci" :rules="rules"></v-autocomplete>
            </v-col>
            <template v-if="antecedentesHospitalarios.hospitalizacion_uci == 'Si'">
              <v-col cols="12" sm="6" md="6">
                <v-text-field label="Fecha de hospitalización en UCI" type="date" dense outlined :max="fechaMimina"
                  v-model="antecedentesHospitalarios.fecha_hospitalizacion_uci_ultimo_ano" :rules="rules">
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-textarea label="Descripción" dense outlined v-model="antecedentesHospitalarios.descripcion_hospi_uci"
                  :rules="rules">
                </v-textarea>
              </v-col>
            </template>
          </v-row>
          <v-col class="d-flex justify-center align-center">
            <v-card-actions>
              <v-btn color="success" small dark @click="guardarAntecedentes()">Agregar antecedentes
              </v-btn>
            </v-card-actions>
          </v-col>

          <v-col cols="12" sm="12" md="12">
            <v-alert text color="blue-grey" dense class="text-center"><b>Historico de antecedentes hospitalarios</b></v-alert>
            <v-data-table :items="historicoAntecedentes" :headers="headers" :loading="loading" dense
              no-data-text="sin registros previos">
              <template v-slot:[`item.user.operador`]="{ item }">
                {{ `${item.user.operador?.nombre || ''} ${item.user.operador?.apellido || ''}`.trim() || 'Sin nombre' }}
                </template>
              <template v-slot:[`item.acciones`]="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon small v-bind="attrs" v-on="on" @click="eliminarItem(item)" color="red"
                      v-if="item.medico_registra === $store.state.auth.usuario.id">
                      mdi-delete
                    </v-icon>
                  </template>
                  <span v-if="item.medico_registra === $store.state.auth.usuario.id">Eliminar resultado</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-col>
        </v-form>
      </v-container>
    </v-card>


  </div>
</template>
<script>
  import moment from 'moment';
  export default {
    name: "",
    props: {
      datos: Object,
      ocupacional: Array,
      resumen: Object
    },

    data() {
      return {
        preload: false,
        historicoAntecedentes: [],
        antecedentesHospitalarios: {
          cantidad_hospitalizaciones: '',
          fecha_ultimas_hospitalizaciones: '',
          hospitalizacion_uci: '',
          fecha_hospitalizacion_uci_ultimo_ano: '',
          descripcion_hospiurg: '',
          descripcion_hospi_uci: ''
        },
        loading: false,
        fechaMimina: moment().format("YYYY-MM-DD"),
        mostrarSegundoCampo: false,
        valid: true,
        mostrarTercerCampo: false,
        alertaSegundaFechaMostrada: false,
        alertaTerceraFechaMostrada: false,
        hospitalizacion_ultimo_anio: '',
        headers: [{
            text: 'Hospitalización/año',
            value: 'cantidad_hospitalizaciones'
          },
          {
            text: 'Fecha última hospitalización',
            value: 'fecha_ultimas_hospitalizaciones'
          },
          {
            text: 'Descripción hospitalización',
            value: 'descripcion_hospiurg'
          },
          {
            text: 'Hospitalización UCI',
            value: 'hospitalizacion_uci'
          },
          {
            text: 'Fecha hospitalizacion UCI',
            value: 'fecha_hospitalizacion_uci_ultimo_ano'
          },
          {
            text: 'Descripción UCI',
            value: 'descripcion_hospi_uci'
          },
          {
            text: 'Usuario que registra',
            value: 'user.operador'
          },
          {
            text: 'Acciones',
            value: 'acciones'
          }
        ],
        rules: [
          v => !!v || 'Este campo es requerido',
        ],
      }
    },

    mounted() {
      this.listarAntececente()
    },

    methods: {

      validarErrores() {
        return [];
      },

      listarAntececente() {
        this.loading = true
        this.$axios.post("/antecedentes-hospitalarios/listarHospitalario", {
            afiliado: this.datos.afiliado.id
          })
          .then((res) => {
            this.historicoAntecedentes = res.data;
          })
          .catch((err) => {
            return this.$toast.error("Error al listar antecedentes");
          }).finally(() => {
            this.loading = false
          })
      },

      guardarAntecedentes() {
        if (!this.$refs.form.validate()) {
          return
        }
        if (
          this.antecedentesHospitalarios.hospitalizacion_ultimo_anio === "No" &&
          this.antecedentesHospitalarios.hospitalizacion_uci === "No"
        ) {
          this.$toast.error("No se puede guardar si ambos campos están marcados como 'No'.");
          return;
        }

        this.preload = true
        this.antecedentesHospitalarios.consulta_id = this.datos.id

        this.antecedentesHospitalarios.medico_registra = this.$store.state.auth.usuario.id
        this.$axios.post("/antecedentes-hospitalarios/guardar", this.antecedentesHospitalarios)
          .then((res) => {
            this.$toast.success(res.data.mensaje);
            this.listarAntececente()
            this.preload = false
          })
          .catch((err) => {
            console.log(err)
            this.preload = false
          });
      },

      eliminarItem(item) {
        return this.$swal({
          title: '¿Estás seguro?',
          text: "¡No podrás revertir esto!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, eliminarlo!',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.value) {
            this.$axios.delete(`antecedentes-hospitalarios/eliminar/${item.id}`)
              .then(() => {
                this.$toast.success('Eliminado con éxito');
                this.listarAntececente();
              })
              .catch((error) => {
                this.$toast.error('Error al eliminar: ' + error.response.data.Error);
              });
          }
        });
      }
    }
  }

</script>
