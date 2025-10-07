<template>
  <div>
    <v-form>
      <v-col cols="12" sm="12" md="12">
        <v-alert class="text-center" dense text outlined type="info" icon="mdi-book-open-page-variant">
          <b>REDES DE APOYO</b></v-alert>
        <v-row>
          <v-col xs="12" sm="6" md="5">
            <v-select v-model="redesApoyo.red" :items="redes" label="Patologias">
            </v-select>
          </v-col>
          <v-col xs="12" sm="6" md="2">
            <v-select v-model="redesApoyo.activo" :items="sino" label="Si / No">
            </v-select>
          </v-col>
          <v-col xs="12" sm="6" md="1">
            <v-btn fab dark color="success" @click="guardarRedesApoyo()" small>
              <v-icon dark>mdi-plus</v-icon>
            </v-btn>
          </v-col>
          <v-col xs="12" sm="6" md="6">
            <v-textarea name="input-7-1" v-model="redesApoyo.club" auto-grow
                        v-if="redesApoyo.red === 'Pertenece a algun Club Social o Cultural' & redesApoyo.activo === 'Si'"
                        label="Cual">
            </v-textarea>
          </v-col>
          <v-col xs="12" sm="6" md="6">
            <v-textarea name="input-7-1" v-model="redesApoyo.observacion" auto-grow
                        v-if="redesApoyo.red === 'Pertenece a algun Club Social o Cultural' & redesApoyo.activo === 'Si'"
                        label="Observacion">
            </v-textarea>
          </v-col>
          <v-col xs="12" sm="12" md="12">
            <v-data-table :items="redesAP" :headers="headerredesApoyo" hide-actions class="elevation-1">
              <template v-slot:item.eliminar={item,index}>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="error" icon small v-on="on" @click="eliminarRed(index,item.id)"><v-icon>mdi-delete</v-icon></v-btn>
                  </template>
                  <span>Eliminar</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-col>
    </v-form>
  </div>
</template>
<script>
export default {
  name: "",
  props: ['datos','resumen'],
  created() {
    this.fetchRedesApoyo();
  },
  data() {
    return {
      redesApoyo: {
        red: null,
        activo: null,
        club: null,
        observacion: null
      },
      redes: ['Trabaja', 'Asiste a la Iglesia', 'Pertenece a algun Club Deportivo', 'Comparte con sus Amigos',
        'Asiste al Colegio', 'Comparte con sus Vecinos', 'Pertenece a algun Club Social o Cultural',
      ],
      headerredesApoyo: [{
        text: 'id',
      },
        {
          text: 'Patologia',
          value: 'red'
        },
        {
          text: 'Si/No',
          value: 'activo'
        },
        {
          text: 'Cual',
          value: 'club'
        },
        {
          text: 'Observacion',
          value: 'observacion'
        },
        {
          text: '',
          value: 'eliminar'
        }
      ],
      redesAP: [],
      sino: ['Si', 'No']
    }
  },
  methods: {
    validarErrores() {
              return [];
            },
    guardarRedesApoyo() {
      if (this.redesApoyo.red === 'Pertenece a algun Club Social o Cultural' && this.redesApoyo.activo === 'Si') {
          if (!this.redesApoyo.club) {
              return this.$toast.error("El campo cual es requerido!");
          }
        }
          this.$axios.post('historia/guardar-red-apoyo/'+this.datos.id, this.redesApoyo)
          .then(res => {
              this.fetchRedesApoyo();
              this.clear();
          })
    },
    fetchRedesApoyo() {
      this.$axios.get(`historia/redes-apoyos/${this.datos.id}`)
          .then(res => {
              this.redesAP = res.data;
          });
    },
    guardarSeguir() {
      this.$emit('respuestaComponente')
    },

    clear() {
      for (const key in this.redesApoyo) {
        this.redesApoyo[key] = ''
      }
    },
    eliminarRed(index,id){
      this.$axios.$delete('historia/eliminar-red-apoyo/'+id)
        .then(res => {
          this.redesAP.splice(index,1)
          this.fetchRedesApoyo();
        })
    }
  }
}

</script>
