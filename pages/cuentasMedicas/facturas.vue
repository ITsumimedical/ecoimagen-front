<template>
  <div>
     <v-dialog v-model="preload" persistent width="300">
          <v-card color="primary" dark>
            <v-card-text>
              Procesando Información
              <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-dialog>
    <v-card>
      <v-card-text>
        <v-alert dense text outlined color="info" class="text-center">Facturas
        </v-alert>
        <v-row>
          <v-col cols="12" sm="12" md="12">
            <v-row>
              <v-col cols="12" sm="6" md="5">
                <v-autocomplete label="Nit-prestador" v-model="filtro.prestador" :items="reps" item-text="nombre"
                  item-value="id" dense :search-input.sync="rep" no-data-text="Por favor diligencie el nombre o nit">
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6" md="5">
                <v-text-field v-model="filtro.factura" label="Factura" dense></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="2">
                <v-btn  color="info" @click="imprimir()">
                  Ver
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <!-- <v-card-actions> -->
          <!-- <v-spacer></v-spacer> -->
          <v-btn  color="warning" @click="compress()">Comprimir PDF por grupos (poco peso)
          </v-btn>
          <v-btn  color="info" @click="compress2()">Comprimir PDF uno por uno (mucho peso)
          </v-btn>
        <!-- </v-card-actions> -->
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  export default {
    name: 'WorkspaceJsonFacturas',

    data() {
      return {
        reps: null,
        rep: null,
        filtro: {
          prestador: '',
          factura: ''
        },
        preload:false
      };
    },

    mounted() {
      // this.listarReps();
    },

    watch: {
      rep(val) {
        if (val) {
          if (val.length >= 4 && this.filtro.prestador ==='') {
            this.listarReps();
          } else if (val.length < 4) {
            this.reps = null;
          }
        } else {
          this.reps = null;

        }
      },
    },

    methods: {

     listarReps() {
        this.preload = true
        this.$axios.post('prestador/listar?page=0',{prestador: this.rep}).then(res => {
             this.reps = res.data.data.map((rep) => {
            return {
              id: rep.id,
              nombre: `${rep.nombre_prestador} - ${rep.nit}`,
            }
          })
           this.preload = false
        }).catch(e => {
          this.preload = false
          console.log(e);
        })
      },

      async imprimir() {
        if (this.filtro.prestador == '' || this.filtro.factura == '') {
          return this.$swal(
            'Valor incorrecto!',
            'Debe ingresar los campos obligatorios.',
            'error'
          )
        }
        let ruta = '/facturascuentasmedicas/' + this.filtro.prestador + '/' + this.filtro.factura + '.pdf';
        try {
          let adj = await this.$adjuntos(ruta);
          let blob = new Blob([adj[1]], {
            type: adj[0],
          });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          window.open(link.href, "_blank");
        } catch (error) {
          console.log(error.Response);
        }
      },

      compress() {
                window.open('https://pdf.io/es/compress/')
            },
            compress2() {
                window.open('https://smallpdf.com/compress-pdf')
            }

    },
  };

</script>

<style lang="scss" scoped>

</style>
