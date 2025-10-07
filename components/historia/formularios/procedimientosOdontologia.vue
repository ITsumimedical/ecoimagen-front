<template>
  <div>
    <v-col cols="12" md="12" sm="12">
      <v-alert color="info" text dense class="text-center" border="left" icon="mdi-tooth" prominent>
        <b>Procedimientos odontológicos realizados </b>
      </v-alert>
    </v-col>

    <v-card-text>
      <v-form ref="procedimientosOdontologicos" lazy-validation>
        <v-row>
          <v-col cols="12" md="9" sm="9">
            <v-autocomplete dense v-model="cup_id" :search-input.sync="FiltroCups" :items="cups" item-text="cups"
              item-value="id" no-data-text="Debe ingresar el nombre del procedimiento" label="Servicios"
              :rules="servicioRules">
            </v-autocomplete>
          </v-col>
          <v-col cols="12" md="2" sm="2">
            <v-text-field label="Cantidad" type="number" v-model="cantidad" dense :rules="cantidadRules"></v-text-field>
          </v-col>
          <v-col>
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-btn color="success" text @click="guardarCupConsulta" :loading="loading" :disabled="loading"
                  v-bind="attrs" v-on="on">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
              <span>Agregar consulta</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>

    <v-data-table :headers="headers" :items="procedimientosCups" :loading="cargando" :disabled="cargando">
      <template v-slot:item.actions="{ item }">
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-btn color="warning" small icon @click="eliminarProcedimiento(item.id)" v-bind="attrs" v-on="on">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
          <span>Eliminar</span>
        </v-tooltip>
      </template>
    </v-data-table>
  </div>
</template>
<script>
  export default {

    props: ['datos'],
    data() {
      return {
        cups: [],
        FiltroCups: '',
        cup_id: '',
        cantidad: '',
        loading: false,
        cargando: false,
        procedimientosCups: [],
        headers: [{
            text: 'Codigo',
            value: 'cup.codigo',
            align: 'center'
          },
          {
            text: 'Nombre del cup',
            value: 'cup.nombre',
            align: 'center'
          },
          {
            text: 'Cantidad',
            value: 'cantidad'
          },
          {
            text: 'Acciones',
            value: 'actions'
          }
        ],
        servicioRules:[
        v => !!v || 'Este campo es requerido',
        ],
        cantidadRules: [
          v => !!v || 'Este campo es requerido',
          v => (!isNaN(v) && v >= 1 && v <= 32) || 'La cantidad debe estar entre 1 y 32',
        ],
      }
    },


    watch: {
      FiltroCups(val) {
        if (val) {
          if (val.length === 4) {
            this.listaCups();
          } else if (val.length < 4) {
            this.cups = null;
          }
        } else {
          this.cups = null;

        }
      },
    },

    mounted() {
      this.listarProcedimientos();
    },

    methods: {
      listarProcedimientos() {
        this.cargando = true;
        this.$axios.get('odontologiaProcedimientos/listarProcedimientos/' + this.datos.id).then(res => {
          this.procedimientosCups = res.data;
          this.cargando = false
        }).catch(error => {
          this.cargando = false;
          this.$toast.error(error)
        })
      },

      listaCups() {
        this.preload = true;
        this.$axios.post('/cup/buscarCupsNombre', {
          nombre: this.FiltroCups,
          idAfiliado: this.datos.afiliado.id
        }).then(res => {
          this.cups = res.data
          this.preload = false;
        }).catch(e => {
          e.response
          this.preload = false;
        })
      },

      guardarCupConsulta() {
        const validacion = this.$refs.procedimientosOdontologicos.validate();

        // Si el formulario no es válido, no continuar
        if (!validacion) {
          return;
        }

        const data = {
          consulta_id: this.datos.id,
          cup_id: this.cup_id,
          cantidad: this.cantidad
        };
        this.loading = true;
        this.$axios.post('odontologiaProcedimientos/agregarCupConsulta', data).then(res => {
          this.loading = false;
          this.$toast.success('Agregado con éxito'),
            this.listarProcedimientos();
          this.limpiar()
        }).catch(error => {
          this.loading = false
          this.$toast.error(error)
        })
      },
      eliminarProcedimiento(id) {
        this.$axios.delete(`odontologiaProcedimientos/eliminar/${id}`).then(() => {
          this.$toast.success('Registro eliminado con éxito');
          this.listarProcedimientos();
        }).catch(error => {
          this.$toast.error('Error al eliminar el registro');
          console.log('Error:', error);
        });
      },

      limpiar() {
        this.cup_id = '',
          this.cantidad = ''
      },

      validarErrores() {
        if (this.procedimientosCups.length === 0) {
          return this.$refs.procedimientosOdontologicos.validate();
        } else {
          return []
        }
      },
    }
  }

</script>
