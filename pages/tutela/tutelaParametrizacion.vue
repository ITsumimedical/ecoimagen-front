<template>
  
    <v-card elevation="0">
      <v-col cols="8">
        <v-card-title>
          <v-toolbar flat>
            <v-toolbar-title>
              <div class="d-flex align-center">
                <img src="/images/ojo.svg" alt="logo horus" height="50px" width="50px" />
                <span>Módulo parametrización de acciones constitucionales</span>
              </div>
            </v-toolbar-title>

          </v-toolbar>
        </v-card-title>
      </v-col>


      <v-card-text>
        <v-tabs grow v-model="tab">
          <v-tabs-slider :color="sliderColor"></v-tabs-slider>

          <v-tab class="responsable-tab">
            <v-icon left class="text-red">mdi-account-badge</v-icon>
            <span class="text-red">Responsable</span>
          </v-tab>
          <v-tab class="proceso-tab">
            <v-icon left class="text-blue">mdi-account-cog</v-icon>
            <span class="text-blue">Proceso</span>
          </v-tab>

          <v-tab class="actuacion-tab">
            <v-icon left class="text-green">mdi-book-cog</v-icon>
            <span class="text-green">Actuación</span>
          </v-tab>

          <v-tab class="juzgados-tab">
            <v-icon left class="text-yellow">mdi-gavel</v-icon>
            <span class="text-yellow">Juzgados</span>
          </v-tab>
          
        </v-tabs>
        <v-tabs-items v-model="tab" color="titulo">
          <v-tab-item v-for="item in items" :key="item.tab">
            <component :is="item.content"></component>
          </v-tab-item>
        </v-tabs-items>

      </v-card-text>
    </v-card>

</template>

<script>
  import juzgadoTutelaComponet from '@/components/tutela/parametrizacion/juzgadoTutela.vue'
  import responsableTutelaComponent from '@/components/tutela/parametrizacion/responsableTutela.vue'
  import procesoTutelaComponent from '@/components/tutela/parametrizacion/procesoTutela.vue'
  import actuacionTutelaComponent from '@/components/tutela/parametrizacion/actuacionTutela.vue'

  export default {
    middleware({
      $can,
      redirect
    }) {
      if (!$can('tutelas.parametrizacion')) {
        return redirect('/');
      }
    },
    name: 'adminTutela',

    data() {
      return {
        tab: null,
        items: [{

            content: responsableTutelaComponent,
          },
          {
            
            content: procesoTutelaComponent,
          },
          {
           
            content: actuacionTutelaComponent,
          },
          {
           
            content: juzgadoTutelaComponet,
          },
        ],
      };
    },
    computed:{
      sliderColor() {
        switch (this.tab) {
          case 0:
            return "#ff5252"; // rojo para responsables
          case 1:
            return "#2196F3"; //azul para procesos

          case 2:
            return "#4CAF50"; //verde para el tipo de actuación

            case 3:
              return "#FF9800" //amarillo para juzgados
          default:
            return "primary";
        }
      },
      
    }
  };

</script>


<style scoped>

.responsable-tab .v-icon,
.responsable-tab span{
  color: #ff5252 !important;
}

.proceso-tab .v-icon,
.proceso-tab span{
  color: #2196F3 !important;
}

.actuacion-tab .v-icon,
.actuacion-tab span{
  color: #4CAF50 !important;
}

.juzgados-tab .v-icon,
.juzgados-tab span{
  color: #FF9800 !important;
}

</style>
