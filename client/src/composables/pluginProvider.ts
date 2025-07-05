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
      console.log('🔌 Found plugin manifest, checking for each plugin in Gun...');
      
      // Check each manifest plugin individually
      for (const manifestPlugin of manifestPlugins) {
        await new Promise<void>((resolve) => {
          let timeout = setTimeout(() => {
            // Timeout = plugin doesn't exist
            console.log(`  ➕ Adding missing plugin: ${manifestPlugin.name}`);
            gun.get('plugins').get(manifestPlugin.name).put(manifestPlugin);
            resolve();
          }, 300);
          
          gun.get('plugins').get(manifestPlugin.name).once((data) => {
            if (data && data.name) {
              console.log(`  ✓ Plugin already exists: ${manifestPlugin.name}`);
            } else {
              console.log(`  ➕ Adding new plugin: ${manifestPlugin.name}`);
              gun.get('plugins').get(manifestPlugin.name).put(manifestPlugin);
            }
            clearTimeout(timeout);
            resolve();
          });
        });
      }
      
      console.log('📦 Plugin manifest processing complete');
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