<template>
<div>
  <v-card>
    <div class="d-flex flex-column">
      <div class="d-flex">
        <div class="pa-2" >
          <div class="font-weight-bold">{{ title }}</div>
          <div class="secondary--text text-body-2 text-caption" ><b style="font-size: 8px !important"></b></div>
        </div>
        <v-spacer></v-spacer>
        <v-menu bottom left>
          <template v-slot:activator="{ on, attrs }">
            <v-tab >

              <v-btn class="mx-2" v-bind="attrs" v-on="on"  dark small :color="color" @click="dataTableHelpdesk(id)">
                <v-icon dark small >
                  {{ contadorArea}}
                </v-icon>
              </v-btn>
            </v-tab>

          </template>
        </v-menu>
      </div>
    </div>
    <v-sheet height="8" width="100%" :color="color" dark class="align-center rounded-b justify-center d-flex">
    </v-sheet>
  </v-card>
 </div>
</template>

<script>
  export default {
    props: {
      id: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: ''
      },
      description: {
        type: String,
        default: ''
      },
      color: {
        type: String,
        default: ''
      },
      contadorArea: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        dataTableIncidente: ''
      }
    },
    methods:{
      dataTableHelpdesk(item){
        console.log('dato', item);
        this.dataTableIncidente = item
      }
    }
  }

</script>
