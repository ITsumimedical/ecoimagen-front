<template>
  <v-menu open-on-hover offset-y :close-on-content-click="false">
    <template v-slot:activator="{ on, attrs }">
      <v-icon v-on="on" v-bind="attrs" color="blue-grey lighten-1">
        mdi-account-group
      </v-icon>
    </template>

    <v-card>
      <v-list v-if="items?.responsables?.length">
        <v-list-item
          v-for="areaResponsable in items.responsables"
          :key="areaResponsable.id"
        >
          <v-list-item-content>
            <v-list-item-title>
              {{ areaResponsable.area_responsable?.nombre || 'Sin área asignada' }}
            </v-list-item-title>
            <v-list-item-subtitle>
              <ul>
                <li>
                  {{ areaResponsable.nombre }} - {{ areaResponsable.correo || 'Sin responsables asignados'}}
                </li>
              </ul>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list v-else>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-subtitle>
              <ul>
                <li>
                  Sin responsables
                </li>
              </ul>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: "AsignadosBarreraAcceso",
  props: {
    items: {
      type: Object,
      required: true
    }
  }
};
</script>
