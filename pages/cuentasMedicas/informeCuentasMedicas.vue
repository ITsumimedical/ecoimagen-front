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
        <v-alert dense text outlined color="info" class="text-center">INFORME CUENTAS MEDICAS
        </v-alert>
        <v-row>
          <v-col cols="12" sm="12" md="12">
            <v-row>
              <v-col cols="12" sm="6" md="2">
                <v-text-field label="Desde" type="date" color="primary" dense v-model="filtro.fechaDesde">
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="2">
                <v-text-field label="Hasta" type="date" color="primary" dense v-model="filtro.fechaHasta">
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-autocomplete :items="tipos" label="Tipo" v-model="filtro.tipo" dense>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6" md="5" >
                <v-autocomplete v-model="filtro.prestador_id" label="Nit-prestador" :items="reps" item-value="nit"
                  item-text="nombre" :search-input.sync="rep" dense>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="12" md="12" v-if="modalActas">
                <v-row dense>
              <v-col cols="12" sm="12" md="12">
                <v-data-table dense :headers="headers" :items-per-page="5" :items="actas" no-data-text="Sin datos para mostrar"
                  >
                  <template v-slot:[`item.accion`]="{ item }">
                    <v-btn  color="#00b297" dark class="mr-2" @click="imprimir(item.ruta)">Ver
                    </v-btn>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn  color="error" @click="limpiarFiltro()">
            Limpiar
          </v-btn>
          <v-btn  color="info" @click="informe()">
            Generar
          </v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
    name: 'WorkspaceJsonInformeCuentasMedicas',

    data() {
      return {
        actas:[],
        reps: null,
        rep: null,
        preload: false,
        departamentos: [],
        municipios: [],
        tipoSolicitudes: [],
        filtro: {
          fechaDesde: moment().format('YYYY-MM-DD'),
          fechaHasta: moment().format('YYYY-MM-DD'),
          tipo: '',
          prestador_id: ''
        },
        pAdmin: false,
        modalActas : false,
         headers: [{
                    text: "id",
                    align: "left",
                    value: "id",

                },
                {
                    text: "Nombre",
                    align: "left",
                    value: "nombre",

                },
                {
                    text: "Fecha Conciliación",
                    align: "left",
                    value: "created_at",
                    sortable: true
                },
                {
                    text: "Accion",
                    align: "left",
                    value: "accion",

                },
            ],
      };
    },

    mounted() {
      // this.listarReps();
    },

     watch:{
    rep(val){
      if(val){
        if (val.length == 4) {
          this.listarReps();
        } else if (val.length < 4) {
          this.reps = null;
        }
      }else{
        this.reps = null;

      }
    }
  },

    computed: {
      tipos() {
        let permisoAdmin = ['cuentasMedicas.adminInforme']
        let tipo = ['Glosas']
        let tipoAdmin = ['Contabilidad', 'Conciliación', 'Trazabilidad', 'No acuerdo', 'Actas'];
        let findPermission = []
        this.$store.state.auth.permissions.forEach(p => {
          let finded = permisoAdmin.find(pa => pa == p)
          if (finded) findPermission.push(finded)
        });
        if (findPermission.length == 1) {
          this.pAdmin = true
          return tipoAdmin
        } else {
          this.pAdmin = false
          return tipo
        }
      }
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

      limpiarFiltro() {
        this.filtro.fechaDesde = moment().format('YYYY-MM-DD'),
          this.filtro.fechaHasta = moment().format('YYYY-MM-DD'),
          this.filtro.tipo = '',
          this.filtro.prestador_id = ''
      },

      informe() {
        if (this.filtro.tipo == 'Actas') {
          let data = {
            prestador: this.filtro.prestador_id,
            fechaDesde: this.filtro.fechaDesde,
            fechaHasta: this.filtro.fechaHasta
          }
          this.$axios.post('radicacion-glosa-sumimedical/actas',data).then(res => {
            this.actas = res.data
            // if(this.actas.length > 0){
              this.modalActas = true
            // }
        }).catch(e => {
          console.log(e);
        })
        }else {
          this.$axios({
          method: 'post',
          params: {
            tipo:this.filtro.tipo,
            prestador: this.filtro.prestador_id,
            fechaDesde: this.filtro.fechaDesde,
            fechaHasta: this.filtro.fechaHasta
          },
          url: '/radicacion-glosa-sumimedical/informe/',
          responseType: 'blob',
        }).then(res => {
          let blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
          });
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement('a');

          a.download = 'Informe' + this.filtro.tipo + '.xlsx';
          a.href = url;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          this.dialog = false
          this.clear();
        }).catch(err => {
          console.log(err)
        })
        }

      },

      async imprimir(ruta){
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
      }

    },
  };

</script>

<style lang="scss" scoped>

</style>
