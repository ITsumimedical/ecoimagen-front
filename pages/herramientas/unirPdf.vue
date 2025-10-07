<template>
    <v-card>
        <v-card-title>
            <v-toolbar flat class="d-flex flex-wrap align-center">
                <v-toolbar-title class="d-flex align-center">
                    <img src="/images/ojo.svg" alt="Ojo Horus" height="50px" width="50px" />
                    <span class="ml-2 font-weight-bold">Unificar documentos PDF</span>
                </v-toolbar-title>
            </v-toolbar>
        </v-card-title>
        <v-card-text>
            <v-row>
                <v-col cols="12">
                    <v-alert type="info" color="#0E4578" outlined>
                        Esta herramienta permite unir documentos PDF en un solo archivo.
                    </v-alert>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <vue2Dropzone ref="pdf" :options="opciones" id="dropzone" :useCustomSlot=true>
                        <h1 style="color:#06213A"><b>Arrastre y suelte los documentos aqui...</b></h1>
                        <br>
                        <h2 style="color:#9CBB49"><b>o haga clic y seleccione desde su computador</b></h2>
                    </vue2Dropzone>
                    <pre></pre>
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn dense dark color="success" @click="procesar">Procesar</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { mapActions } from 'vuex';
import { unirPdf } from '@/utils/pdfUtils.js';
import vue2Dropzone from 'vue2-dropzone';
import 'vue2-dropzone/dist/vue2Dropzone.min.css'


export default {
    name: 'UnirPdf',
    components:{
        vue2Dropzone
    },
    data() {
        return {
            opciones:{
                acceptedFiles: 'application/pdf',
                autoProcessQueue: false,
                url: '#',
                thumbnailWidth: 50,
                addRemoveLinks: true,
                dictRemoveFile: "Eliminar",
                    
            }
        };
    },
    methods: {
        ...mapActions('app', ['setPreload']),

        async procesar() {
            const pdfs = this.$refs.pdf.getAcceptedFiles()
            if (!pdfs || pdfs.length <= 1) {
                this.$toast.error('Debe seleccionar al menos dos archivos PDF.')
                return;
            }
            this.setPreload(true)
            try{
                const mergedPdfBytes = await unirPdf(pdfs)
                this.generarPdf([mergedPdfBytes]);
                this.$toast.success('PDFs unidos correctamente');
            }catch(error){
                this.$toast.error('Error al procesar los archivos PDF');
                console.log(error)
            }finally{
                this.setPreload(false)
                this.$refs.pdf.removeAllFiles()
            }
        },

        generarPdf(file) {
            let blob = new Blob(file, {
                type: 'application/pdf',
            });
            let link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob)
            window.open(link.href, "_blank")
            link.remove()

        },
        


    }
}
</script>
<style scoped>
.vue-dropzone.dz-drag-hover {
  background-color: #E6F2FC; 
  border-color: #06213A;
  border-style: dotted;
}


::v-deep(.vue-dropzone .dz-preview .dz-remove) {
  background-color: #f44336;
  color: white;
  padding: 4px 8px;
  border-radius: 10px;
  text-decoration: none;
  font-size: 10px;
  display: inline-block;
  margin-top: 5px;
  transition: background-color 0.2s ease;
  
}

::v-deep(.vue-dropzone .dz-preview .dz-remove:hover) {
  background-color: #d32f2f;
}

</style>