import { ref, inject, provide, watch, onMounted, onUnmounted } from 'vue';
import gun from '@/services/gun';

export function pluginProvider() {
  const plugins = ref<Plugin[]>([]);
  const routes = ref<Route[]>([]);
  const slots = ref<Slot[]>([]);
  const tabs = ref<Tab[]>([]);

  onMounted(async () => {
    // Check if we need to bootstrap plugins from manifest
    const manifestPlugins = (window as any).TRIBELIKE_PLUGIN_MANIFEST;
    if (manifestPlugins && manifestPlugins.length > 0) {
      console.log('🔌 Found plugin manifest, checking Gun for existing plugins...');
      
      // Check if plugins already exist in Gun
      let hasPlugins = false;
      await new Promise<void>((resolve) => {
        let timeout = setTimeout(() => resolve(), 500); // Wait max 500ms
        gun.get('plugins').once((data) => {
          if (data && Object.keys(data).filter(k => k !== '_').length > 0) {
            hasPlugins = true;
          }
          clearTimeout(timeout);
          resolve();
        });
      });

      if (!hasPlugins) {
        console.log('📦 No plugins in Gun, bootstrapping from manifest...');
        // Bootstrap plugins from manifest
        manifestPlugins.forEach((plugin: any) => {
          console.log(`  ➕ Adding plugin: ${plugin.name}`);
          gun.get('plugins').get(plugin.name).put(plugin);
        });
      } else {
        console.log('✅ Plugins already exist in Gun');
      }
    }

    // Now load plugins from Gun as usual
    gun.get('plugins')
    .map()
    .once(plugin => {
      if (plugin) {
        plugins.value?.push(plugin);
        gun.get(plugin.paths)
        .map()
        .once(data => {
          if (data) {
            routes.value?.push(data);
          }
        });

        gun.get(plugin.slots)
        .map()
        .once(data => {
          if (data) {
            const slot = { plugin: plugin, ...data };
            slots.value?.push(slot);
          }
        });

        gun.get(plugin.tabs)
        .map()
        .once(data => {
          if (data) {
            tabs.value?.push(data);
          }
        });
      }
    });
  });

  onUnmounted(() => {
    plugins.value = [];
    routes.value = [];
    slots.value = [];
    tabs.value = [];
  });

  provide('plugin', {
    plugins,
    routes,
    slots,
    tabs,
  });
}

export function usePlugins() {
  const data = inject('plugin');

  if (!data) {
    throw new Error('Composable must have an plugin provider.');
  }

  return data;
}