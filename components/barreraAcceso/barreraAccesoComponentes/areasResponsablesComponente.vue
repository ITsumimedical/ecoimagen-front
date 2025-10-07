<template>
    <v-menu open-on-hover right offset-y>
		<template v-slot:activator="{ on }">
			<v-icon small v-on="on" @mouseover="obtenerAreasResponsables()" color="primary">mdi-account-group</v-icon>
		</template>
		<v-list v-if="areaResponsables && areaResponsables.length > 0">
			<v-list-item v-for="areaResponsable in areaResponsables" :key="areaResponsable.id">
				<v-list-item-content>
					<v-chip label color="blue-grey lighten-5">
						<v-icon color="primary">mdi-account-tie</v-icon>
						<b>{{ areaResponsable.nombre }}</b>
					</v-chip>
				</v-list-item-content>
			</v-list-item>
		</v-list>
	</v-menu>
</template>
<script>
export default {
	props: {
		item: Object,
	},
	data() {
		return {
			areaResponsables: [],
		}
	},

	methods: {
		obtenerAreasResponsables() {
			if(this.areaResponsables.length > 0){
				return;
			}
			this.$axios
				.post("/responsable-barrera-acceso/responsable-por-area/" + this.item.id)
				.then((res) => {
					this.areaResponsables = res.data;
				})
				.catch((error) => {
					this.$toast.error("Error al listar los responsables asignados");
				});
		},
	}
}
</script>
