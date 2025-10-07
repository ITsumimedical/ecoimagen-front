<template>
	<v-dialog v-model="mostrarModalManuales" max-width="900px" persistent>
		<v-card>
			<v-alert text dense border="left" type="info" icon="mdi-book-alert-outline">
				<b>Manuales</b>
			</v-alert>
			<v-card-text>
				<div v-for="item in manuales" :key="item.id">
					<div class="fila_texto">
						<p class="text-body-1">{{ item.nombre }}</p>
						<v-btn elevation="0" color="primary" small @click="descargarManual(item.url)">Visualizar</v-btn>
					</div>

					<v-divider></v-divider>
				</div>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="error" small @click="cerrarModal"> Cerrar </v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script>
	import {
		mapActions
	} from "vuex";

	export default {
		props: {
			mostrarModalManuales: {
				type: Boolean,
				default: false,
			},
		},
		data() {
			return {
				manuales: [],
			};
		},
		watch: {
			mostrarModalManuales(newValue) {
				if (newValue) {
					this.buscarManuales();
				}
			},
		},
		methods: {
			...mapActions("app", ["setPreload"]),

			cerrarModal() {
				this.$emit("update:mostrarModalManuales", false);
			},

			buscarManuales() {
				this.setPreload(true);
				this.$axios
					.get("/manuales/listarActivos")
					.then((response) => {
						this.manuales = response.data;
					})
					.catch((error) => {
						this.$toast.error("Ocurrió un error al cargar los manuales");
					})
					.finally(() => {
						this.setPreload(false);
					});
			},

			async descargarManual(ruta) {
				try {
					this.setPreload(true);
					let adj = await this.$adjuntos(ruta);
					let blob = new Blob([adj[1]], {
						type: adj[0],
					});
					let link = document.createElement("a");
					link.href = window.URL.createObjectURL(blob);
					window.open(link.href, "_blank");
				} catch (error) {
					this.$toast.error("Ocurrio un error al descargar el manual");
				} finally {
					this.setPreload(false);
				}
			}

		},
	};

</script>
<style scoped>
	.fila_texto {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}

</style>
