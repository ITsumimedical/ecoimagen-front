<template>
    <v-container fluid>
        <TurnoListarComponent />
    </v-container>
</template>
<script>
import TurnoListarComponent from "@/components/turno/TurnoListarComponent.vue"
export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
    components:{
        TurnoListarComponent
    }
}
</script>
