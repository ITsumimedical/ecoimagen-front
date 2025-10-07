<template>
  <div>
    <v-card>
      <v-alert class="text-center" dense text outlined type="info" icon="mdi-book-open-page-variant">HISTORICO DE
        ATENCIONES OCUPACIONALES
      </v-alert>
      <v-card-title>
        <v-col cols="12" md="3">
            <v-text-field v-model="documento" clearable @click:clear="limpiarData()" @keyup.enter="buscarAtenciones()" dense outlined label="Número de identificación" required></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-btn color="primary" class="mb-7" @click="buscarAtenciones" small type="submit">Buscar</v-btn>
          </v-col>
        <v-spacer></v-spacer>
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
      </v-card-title>
          <v-data-table :headers="headers" dense :items="historicoConsultas" disable-pagination :loading="loadingTable"
            loading-text="Cargando... por favor espere" hide-default-footer>
            <template v-slot:[`item.afiliado`]="{ item }">
              {{item.afiliado.nombre_completo}}
            </template>
            <template v-slot:[`item.medico`]="{ item }">
            <td v-for="medico in item.agenda.medicos" :key="medico.id">
              {{medico.empleado.nombre_completo}}
            </td>
          </template>
            <template v-slot:[`item.fecha_consulta`]="{ item }">
              {{item.fecha_hora_inicio}}
          </template>
            <template v-slot:[`item.especialidad`]="{ item }">
              {{item.agenda.cita.especialidad.nombre}}
            </template>
            <template v-slot:[`item.tipo`]="{ item }">
                <!-- <pre>{{ item }}</pre> -->
              {{item.tipo_consulta.nombre}}
            </template>
            <template v-slot:[`item.acciones`]="{ item }">
              <div class="text-center">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">

                    <v-btn class="mx-1" fab dark x-small color="blue" v-on="on" @click="imprimir(item.id,'historia')">
                      <v-icon dark>
                        mdi-download
                      </v-icon>
                    </v-btn>

                  </template>
                  <span>Descargar Historia</span>
                </v-tooltip>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn class="mx-1" fab dark x-small color="warning" v-on="on"
                      @click="imprimir(item.id,'consentimientoInformado')">
                      <v-icon dark>
                        mdi-account-check
                      </v-icon>
                    </v-btn>

                  </template>
                  <span>Descargar Consentimiento Informado</span>
                </v-tooltip>
              </div>
            </template>
            <template v-slot:no-data>
            </template>
          </v-data-table>
    </v-card>
  </div>
</template>

<script>
  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },

    name: "historicoConsultas",
    data: () => ({
        search: '',
      loadingTable: false,
      documento: null,
      historicoConsultas: [],
      headers: [{
          text: 'F.Atención',
          align: 'center',
          sortable: false,
          value: 'fecha_hora_inicio',
        },
        {
          text: 'Afiliado',
          align: 'center',
          sortable: false,
          value: 'afiliado',
        },
        {
          text: 'Atendido Por',
          align: 'center',
          sortable: false,
          value: 'medico',
        },
        {
          text: 'Fecha consulta',
          align: 'center',
          sortable: false,
          value: 'fecha_consulta',
        },
        {
          text: 'Especialidad',
          align: 'center',
          sortable: false,
          value: 'especialidad',
        },
        {
          text: 'Tipo',
          align: 'center',
          sortable: false,
          value: 'tipo',
        },
        {
          text: 'Acciones',
          align: 'center',
          sortable: false,
          value: 'acciones',
        }
      ],
    }),
    methods: {
      buscarAtenciones() {
        this.loadingTable = true;
        this.$axios.get('/historia/historicoAtencionesOcupacionales/' + this.documento).then(res => {
          this.historicoConsultas = res.data;
          this.loadingTable = false;
          console.log('asd', this.historicoConsultas);
          if (this.historicoConsultas.length < 1) {
            return this.$swal({
          title: "¡No se registran atenciones ocupacionales del documento ingresado!",
          type: "warning",
        });
          }
        }).catch(e => {
          this.loadingTable = false;
        })
      },

      limpiarData(){
        this.historicoConsultas = [],
        this.documento = ''
      },

      imprimir(id, tipo) {
        // if (this.history) {
        const data = {
          tipo: tipo,
          consulta: id
        }
        this.$axios.post('pdf', data, {
          responseType: "arraybuffer"
        }).then(res => {
          let blob = new Blob([res.data], {
            type: "application/pdf"
          });
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          window.open(link.href, "_blank");
        });
        // }
      },
    }
  }

</script>

<style lang="scss" scoped>

</style>
