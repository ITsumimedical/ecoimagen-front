<template>
  <div>
    <v-card>
        <v-card-title>
      <v-toolbar flat>
        <v-toolbar-title>
          <div class="d-flex align-center">
            <img src="/images/ojo.svg" alt="" height="50px" width="50px">
            <span>AUDITORIA DE SOLICITUDES</span>
          </div>
        </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
      </v-toolbar>
    </v-card-title>
      <v-container fluid class="grey lighten-5">
        <v-row>

          <v-col cols="12" md="12">
            <v-autocomplete dense outlined @change="cargarComponente" v-model="componenteSeleccionado" label="Tipo transacción*" :items="tipoSolicitud" item-text="nombre" return-object></v-autocomplete>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <br>
    <component v-bind:is="componenteActivo" :tipo="tipo"></component>


  </div>
</template>
<script>
import SolicituddeCompras from "~/components/farmacia/bodegas/auditoria/solicitudCompras";
import Traslado from "~/components/farmacia/bodegas/auditoria/traslado";
import {listarTiposSolicitudBodegas} from "~/api/tipoSolicitudBodegas/tipoSolicitudBodega";

export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('farmacia.auditorias')) {
        return redirect('/');
      }
    },
  name:"auditoriaSolicitudes",
  components:{
    SolicituddeCompras,
    Traslado
  },

  mounted() {
    this.listarTiposSolicitudBodegas();
  },
  data: () => ({
    tipo:null,
    componenteActivo:null,
    componenteSeleccionado:null,
    tipoSolicitud: [],
  }),
  methods:{
    listarTiposSolicitudBodegas(){
      this.$loadingGetRequest(listarTiposSolicitudBodegas(0,0)).then(res => {
        this.tipoSolicitud = res.data.map(s => {
          if(s.id === 1 || s.id === 2 ){
            return{
            id:s.id,
              nombre: s.nombre,
              componente: s.nombre.replaceAll(' ','')
            }
          }
        });
      }).catch(e => {console.log(e.response)})
    },
    cargarComponente(){
      this.tipo = this.componenteSeleccionado.id;
      this.componenteActivo = this.componenteSeleccionado.componente
    }
  }
}
</script>
