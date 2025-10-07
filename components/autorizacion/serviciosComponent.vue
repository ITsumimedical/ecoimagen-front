<template>
  <div>
    <v-card>
      <v-alert text dense color="success" border="left" icon="mdi-plus-circle-multiple"><b>Agregar nuevo servicio</b>
      </v-alert>
      <v-form ref="serviciosForm" v-model="valid" lazy-validation>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="12" md="12">
              <v-autocomplete v-model="servicio.cup_id" dense :search-input.sync="FiltroCups" :items="cups"
                item-text="cups" item-value="id" no-data-text="Debe ingresar el nombre del procedimiento"
                label="Nuevo servicio (CUPS)" outlined :rules="[v => !!v || 'El campo es requerido']">
              </v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field v-model="servicio.cantidad" label="Cantidad" type="number" outlined dense
                :rules="[v => !!v || 'El campo es requerido']"></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-text-field type="date" label="Vigencia desde" v-model="servicio.fecha_vigencia" outlined dense
                :rules="[v => !!v || 'El campo es requerido']"></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="12">
              <v-textarea label="Observación" v-model="servicio.observacion" outlined dense
                :rules="[v => !!v || 'El campo es requerido']"></v-textarea>
            </v-col>
          </v-row>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn small color="red" dark @click="cerrarDialog()">Cerrar</v-btn>
            <v-btn color="success" @click="agregarCupNuevo()" :loading="loading" small>Agregar</v-btn>
          </v-card-actions>
        </v-card-text>
      </v-form>
    </v-card>
  </div>
</template>

<script>
  export default {
    props: {
      articulo: {
        type: Object,
        required: true
      },
      cirugia: {
        type:Boolean,
        default: false
      }

    },
    data() {
      return {
        servicio: {
          cup_id: '',
          cantidad: '',
          fecha_vigencia: '',
          observacion: ''
        },
        FiltroCups: '',
        cups: [],
        loading: false,
        serviciosForm: false,
        valid: false
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

    methods: {


      agregarCupNuevo() {
        if (this.$refs.serviciosForm.validate()) {
          const data = {
            cup_id: this.servicio.cup_id,
            cantidad: this.servicio.cantidad,
            fecha_vigencia: this.servicio.fecha_vigencia,
            observacion: this.servicio.observacion,
            cirugia: this.cirugia
          };
          this.loading = true;
          this.$axios.post('ordenamiento/agregarNuevoCup/' + this.articulo.id, data).then(() => {
            this.$toast.success('Agregado con exito');
            this.$emit('servicioAgregado');
            this.loading = false;
          }).catch(error => {
            this.$toast.error(error.response ?.data ?.Error);
            this.loading = false;
          })
        } else {
          this.$toast.error('Por favor, complete todos los campos obligatorios');
        }
      },

      listaCups() {
        this.preload = true;
        this.$axios.post('/cup/buscarCupsNombre', {
          nombre: this.FiltroCups,
          idAfiliado: this.articulo.consulta.afiliado.id
        }).then(res => {
          this.cups = res.data
          this.preload = false;
        }).catch(e => {
          e.response
          this.preload = false;
        })
      },

      cerrarDialog() {
      // Limpiar los campos
      this.servicio = {
        cup_id: '',
          cantidad: '',
          fecha_vigencia: '',
          observacion: ''
      };
      this.campoBusqueda = '';
      // Cerrar el diálogo
      this.$emit('close-dialog');
    }
    }
  }

</script>

<style>

</style>
