<template>
  <div>
    <v-card>
      <v-container class="grey lighten-5">
        <form @submit.prevent="agregarArticulo(articulo,cantidadSolicitada)">
        <v-row>
          <v-col cols="12" md="6">
            <v-autocomplete v-model="formTraslados.bodega_destino_id" label="Bodega Solicitante*" :items="listaBodegas" item-text="nombre" hint="(Bodega solicitante)" persistent-hint  item-value="id" required></v-autocomplete>
          </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete v-model="formTraslados.bodega_origen_id" label="Bodega despacho*" :items="listaBodegas.filter(s => parseInt(s.id) !== parseInt(formTraslados.bodega_destino_id))" item-text="nombre" item-value="id" hint="(Bodega de salida)" persistent-hint required @change="listarVademecum"></v-autocomplete>
            </v-col>
         <v-col cols="12" md="10">
            <v-autocomplete @input="cantidadDisponible = articulo.cantidad_total" v-model="articulo" label="Articulo*" :items="listaMedicamentos.filter(s => !listaArticulosAgregados.map(item => String(item.medicamento_id)).includes(s.medicamento_id))" :item-text="listaMedicamentos => listaMedicamentos.invima?listaMedicamentos.codesumi.codigo+' (' + listaMedicamentos.codesumi.nombre+' - '+listaMedicamentos.invima.titular+'- '+listaMedicamentos.invima.cum_validacion+')':listaMedicamentos.codesumi.codigo+' (' + listaMedicamentos.codesumi.nombre+' - '+')'" return-object required></v-autocomplete>
          </v-col>
           <v-col cols="12" md="2">
            <v-text-field v-model="cantidadDisponible" type="number" solo readonly hint="(Disponible)" persistent-hint></v-text-field>
          </v-col>
          <v-col cols="12" md="12">
            <v-text-field v-model="cantidadSolicitada" type="number" label="Cantida Solicitada*" required></v-text-field>
          </v-col>
          <v-col cols="12" md="2" offset-md="10">
            <v-btn color="primary" type="submit">Agregar</v-btn>
          </v-col>
        </v-row>
        </form>


        <v-row>
          <v-col cols="12" md="12">

            <v-simple-table>
              <template v-slot:default>
                <thead>
                <tr>
                  <th class="text-center">#</th>
                  <th class="text-center">Codigo</th>
                  <th class="text-center">Medicamento</th>
                  <th class="text-center">Presentacion</th>
                  <th class="text-center">Cantidad Solicitada</th>
                  <th class="text-center"></th>
                </tr>
                </thead>
                <tbody>
                  <!-- <pre>{{listaArticulosAgregados}}</pre> -->
                <tr v-for="(item,index) in listaArticulosAgregados" :key="item.id">
                  <td class="text-center">{{ index+1 }}</td>
                  <td class="text-center">{{ item.articulo.invima.cum_validacion}}</td>
                  <td class="text-center">{{ item.articulo.codesumi.nombre}}</td>
                  <td class="text-center">{{ item.articulo.invima.descripcion_comercial}}</td>
                  <td class="text-center">{{ item.cantidad_inicial}}</td>
                  <td class="text-center">
                    <v-btn class="mx-2" fab dark small color="error" @click="eliminarArticulo(index)">
                      <v-icon dark>mdi-close</v-icon>
                    </v-btn>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
          <v-col cols="12" md="12">
            <v-btn v-if="listaArticulosAgregados.length > 0" block color="success" @click="enviarSolicitud">Enviar Solicitud</v-btn>
          </v-col>
        </v-row>


      </v-container>
    </v-card>
  </div>
</template>
<script>
import {listarBodegas} from "~/api/bodegas/bodegas";


export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('farmacia.movimientos')) {
        return redirect('/');
      }
    },
  name:"traslado",
  props:["tipo"],
  mounted() {
    this.listarBodegas();
  },
  data: () => ({
    listaBodegas:[],
    listaMedicamentos:[],
    listaArticulosAgregados:[],
    articulo:null,
    cantidadDisponible:0,
    cantidadSolicitada:null,
    formTraslados:{
      bodega_origen_id:null,
      bodega_destino_id:null
    }
  }),
  methods:{
     listarBodegas() {
        // this.preload = true;
        this.$axios.get('/bodegas/listar').then(res => {
          this.listaBodegas = res.data;
        }).catch(e => {
          console.log(e.response)
        })
      },
    listarVademecum(){
       this.$axios.post('/medicamentos/listarMedicamentoBodegaTraslado',{bodega:this.formTraslados.bodega_origen_id}).then(res => {
          this.listaMedicamentos = res.data;
        }).catch(e => {
          console.log(e.response);

        })
    },
    agregarArticulo(articulo,cantidadSolicitada){
      if(parseInt(cantidadSolicitada) <= 0 || parseInt(cantidadSolicitada) > parseInt(this.cantidadDisponible)){
        return this.$swal(
          'Valor incorrecto!',
          'El Campo "Cantidad solicitada" debe tener un valor mayor a 0 y menor a la cantidad disponible del articulo',
          'error'
        )
      }
      const data = {
        articulo:articulo,
        medicamento_id:articulo.medicamento_id,
        cantidad_inicial:cantidadSolicitada
      }
      this.listaArticulosAgregados.push(data)
      this.cantidadSolicitada = null;
      this.cantidadDisponible = 0;
      this.articulo = null;
    },
    limpiarFormulario() {
      this.cantidadDisponible = 0;
      this.formTraslados.bodega_destino_id = null;
      this.articulo = null;
    },
    eliminarArticulo(id){
      this.listaArticulosAgregados.splice(id,1);
    },
    enviarSolicitud(){
      this.$swal({
        title: 'Esta Seguro?',
        text: "Generar Solicitud de Traslado",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Guardar'
      }).then((result) => {
        if (result.value) {
          let form = this.formTraslados;
          form.tipo_solicitud_bodega_id = this.tipo;
          form.articulos = this.listaArticulosAgregados;
          // this.$loadingPostRequest(crearsolicitudBodegas(),form).then(res => {
          //   this.articulo = null;
          //   this.cantidadSolicitada = null;
          //   this.cantidadDisponible = 0;
          // this.listaArticulosAgregados = [];
          //   this.formTraslados.bodega_origen_id = null;
          //   this.formTraslados.bodega_destino_id = null
          //   this.$toast.success('Se ha registrado la solicitud con id:' + ' ' + res.data.id)
          // })
          this.$axios.post('/solicitud-bodegas/crearTraslado',form).then(res => {
            this.articulo = null;
            this.cantidadSolicitada = null;
            this.cantidadDisponible = 0;
          this.listaArticulosAgregados = [];
            this.formTraslados.bodega_origen_id = null;
            this.formTraslados.bodega_destino_id = null
             this.$swal({
                title: 'Traslado',
                text: 'Se ha registrado la solicitud con id:' + ' ' + res.data,
                type: 'info',
                showCancelButton: false,
                cancelButtonColor: '#d33',
              })
        }).catch(e => {
          console.log(e.response);

        })
        }
      })
    }
  }
}
</script>
