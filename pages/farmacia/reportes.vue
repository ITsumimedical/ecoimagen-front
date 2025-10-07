<template>
  <div>
    <v-row>
      <v-col cols="12" sm="12" md="12">
        <v-card>
          <v-alert dense text outlined color="info" class="text-center">Descargar reporte
          </v-alert>

          <v-container fluid>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-autocomplete :items="resoluciones" item-text="nombre" item-value="id" v-model="resolucion" label="Informe"></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="fecha.fecha_inicial" dense
                              label="Fecha inicial" type="date" >
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="fecha.fecha_final" dense
                              label="Fecha inicial" type="date" >
                </v-text-field>
              </v-col>

            </v-row>
            <v-card-actions>
              <v-spacer>

              </v-spacer>
              <v-col cols="2" sm="2" md="1">
                <v-btn small @click="reporte()"  dark color="info">Descargar</v-btn>
              </v-col>
            </v-card-actions>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  middleware({
               $can,
               redirect
             }) {
    if (!$can('teleapoyo.vista')) {
      return redirect('/');
    }
  },
  name: 'FarmaciaReporte',

  data() {
    return {
      fecha:{
        fecha_inicial:'',
        fecha_final:''
      },
      resoluciones:[
        {
          id: 1,
          nombre: '256 (Autorización Servicios de Salud)'
        },
        {
          id: 2,
          nombre: '1604 (Gestion de Pendientes)'
        },
        {
          id: 3,
          nombre: 'Dispensados'
        },
        {
          id: 4,
          nombre: 'Circular 005'
        },
        {
          id: 5,
          nombre: 'Inadecuaciones'
        },
        {
          id: 6,
          nombre: 'Medicamentos Dispensados'
        },
        {
          id: 7,
          nombre: 'Entrega Medicamentos FIAS'
        },
        {
          id: 8,
          nombre: 'Inadecuaciones'
        },
        {
          id: 9,
          nombre: 'Vademecum Actualizado'
        },
        {
          id: 10,
          nombre: 'Medicamentos Ordenados'
        },
      ]
    };
  },

  mounted() {
    this.contador()
  },

  methods: {

    contador(){
      this.$axios.get('teleapoyo/contador').then(res => {
        this.teleapoyos[0].title = (res.data.total).toString();
        this.teleapoyos[1].title = res.data.solucionados.toString();
        this.teleapoyos[2].title = res.data.pendientes.toString();
      })
    },

    reporte(){
      this.$axios({
        method: 'post',
        params: {
          fecha_inicial: this.fecha.fecha_inicial,
          fecha_final: this.fecha.fecha_final
        },
        url: '/teleapoyo/reporte',
        responseType: 'blob',
      }).then(res => {
        let blob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');

        a.download = 'InformeTeleapoyo.xlsx';
        a.href = url;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        this.clear();
      }).catch(err => {
        console.log(err)
      })
    }
  },


};
</script>

<style lang="scss" scoped>

</style>
