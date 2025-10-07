<template>
  <div id="app">
    <vueSignature ref="signature" :sigOption="option" :w="'400'" :disabled="disabled"></vueSignature>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn small color="warning" @click="clear">Limpiar</v-btn>
      <v-btn small color="info" @click="undo">Deshacer</v-btn>
      <v-btn small color="error" @click="cerrarDialogo()">Cerrar</v-btn>
      <v-btn small color="success" @click="save">Guardar</v-btn>
    </v-card-actions>


  </div>
</template>

<script>
  import vueSignature from "vue-signature";
  export default {
    name: "app",
    components: {
      vueSignature,
    },
    props: ['empleado_id_firma'],
    data() {
      return {
        option: {
          penColor: "rgb(0, 0, 0)",
          backgroundColor: "rgb(255,255,255)",
        },
        disabled: false,

      };
    },
    methods: {
      save() {

       const config = {
      headers: { 'content-type': 'multipart/form-data' }
   }
        let formdata =  new FormData();
        formdata.append("firma", this.$refs.signature.save())
        formdata.append("empleado_id", this.empleado_id_firma)
        this.$axios.post('empleados/firma', formdata,config).then(res => {
          console.log('ee', res.data);
        }).catch(e => {

        })

      },
      clear() {
        var _this = this;
        _this.$refs.signature.clear();
      },
      undo() {
        var _this = this;
        _this.$refs.signature.undo();
      },
      addWaterMark() {
        var _this = this;
        _this.$refs.signature.addWaterMark({
          text: "mark text", // watermark text, > default ''
          font: "20px Arial", // mark font, > default '20px sans-serif'
          style: "all", // fillText and strokeText,  'all'/'stroke'/'fill', > default 'fill
          fillStyle: "red", // fillcolor, > default '#333'
          strokeStyle: "blue", // strokecolor, > default '#333'
          x: 100, // fill positionX, > default 20
          y: 200, // fill positionY, > default 20
          sx: 100, // stroke positionX, > default 40
          sy: 200, // stroke positionY, > default 40
        });
      },
      fromDataURL(url) {
        var _this = this;
        _this.$refs.signature.fromDataURL("data:image/png;base64,iVBORw0K...");
      },
      handleDisabled() {
        var _this = this;
        _this.disabled = !_this.disabled;
      },

      cerrarDialogo() {
        this.$emit("cerrarDialogoFirma");
        this.clear()
      }
    },
  };

</script>
