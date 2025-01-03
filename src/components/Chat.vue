<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { Form } from '@primevue/forms';
import { FormField } from '@primevue/forms';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Button from 'primevue/button';
import Message from 'primevue/message';
import WhatsAppLogo from '../assets/brand-whatsapp.svg';
import TelegramLogo from '../assets/brand-telegram.svg';

type Platform = {
  name: string,
  code: string,
  logo: string,
  field: {
    phone: boolean,
    username: boolean,
  },
}

type FormValue = {
  platform: string,
  phone: {
    show: boolean,
    value: string,
  },
  username: {
    show: boolean,
    value: string,
  },
}

const fallbackImage = 'https://via.placeholder.com/24x24/eee/eee';

const selectedPlatform = ref<Platform | null>(null);
const dataPlatform = ref([
  { name: 'WhatsApp', code: 'whatsapp', logo: WhatsAppLogo, field: { phone: true, username: false } },
  { name: 'Telegram', code: 'telegram', logo: TelegramLogo, field: { phone: false, username: true } },
]);

selectedPlatform.value = dataPlatform.value.find(platform => platform.code === 'whatsapp') || null;

const toast = useToast();

const initialValues: FormValue = reactive({
  platform: '',
  phone: {
    show: false,
    value: '',
  },
  username: {
    show: false,
    value: '',
  },
});

const phoneError = ref('');
const usernameError = ref('');

const phonePattern = /^(?:\+|08)[0-9]{9,14}$/;
const usernamePattern = /^[^\s]+$/;

const cleanPhoneNumber = (value: string): string => {
  return value.replace(/(?!^\+)[^\d]/g, '');
};
const cleanUsername = (value: string): string => {
  return value.replace(/\s+/g, '');
};

const validateInputPhone = () => {
  initialValues.phone.value = cleanPhoneNumber(initialValues.phone.value);

  const phone = initialValues.phone.value;

  if (!phone.startsWith('08') && !phone.startsWith('+')) {
    phoneError.value = 'Nomor ponsel harus diawali dengan 08 atau +';
  } else if (!phonePattern.test(phone)) {
    phoneError.value = 'Nomor ponsel minimal 10 digit dan maksimal 15 digit';
  } else {
    phoneError.value = '';
  }
};
const validateInputUsername = () => {
  initialValues.username.value = cleanUsername(initialValues.username.value);

  const username = initialValues.username.value;

  if (!usernamePattern.test(username)) {
    usernameError.value = 'Username tidak boleh mengandung spasi';
  } else {
    usernameError.value = '';
  }
};

const preventInvalidPhone = (event: KeyboardEvent) => {
  const input = event.target as HTMLInputElement;
  const key = event.key;
  const currentValue = input.value;
  const cursorPosition = input.selectionStart || 0;
  const allowedChars = /^\d$/;

  if (key === '+') {
    if (cursorPosition !== 0 || currentValue.includes('+')) {
      event.preventDefault();
    }
    return;
  }

  if (!allowedChars.test(key)) {
    event.preventDefault();
  }
};
const preventInvalidUsername = (event: KeyboardEvent) => {
  const allowedChars = /^[^\s]$/;
  const key = event.key;

  if (!allowedChars.test(key)) {
    event.preventDefault();
  }
};

const resolver = ({ values }: { values: any }) => {
  const errors: Record<string, any> = {};

  if (!values.platform) {
    errors.platform = [{ message: 'Silakan pilih salah satu' }];
  }

  if (selectedPlatform.value?.field.phone && !values.phone) {
    errors.phone = [{ message: 'Nomor ponsel harus diisi' }];
  } else if (selectedPlatform.value?.field.phone && phoneError.value) {
    errors.phone = [{ message: phoneError.value }];
  }

  if (selectedPlatform.value?.field.username && !values.username) {
    errors.username = [{ message: 'Username harus diisi' }];
  } else if (selectedPlatform.value?.field.username && usernameError.value) {
    errors.username = [{ message: usernameError.value }];
  }

  return { errors };
};

const onFormSubmit = ({ valid }: { valid: boolean }) => {
  if (valid) {
    toast.add({
      severity: 'success',
      summary: 'Form berhasil dikirim',
      detail: 'Terima kasih atas partisipasinya',
      life: 5000
    });
  }
};

watch(selectedPlatform, (newValue) => {
  if (newValue) {
    initialValues.phone.show = newValue.field.phone;
    initialValues.username.show = newValue.field.username;
  }
}, { immediate: true });
</script>

<template>
  <div class="flex justify-center items-center min-h-screen p-6 main-layout">
    <div class="w-full max-w-lg">

      <Toast />

      <Form :initialValues="initialValues" :resolver="resolver" @submit="onFormSubmit" class="flex flex-col gap-8 w-full">
        <FormField v-slot="$field" name="platform" initialValue="whatsapp" class="flex flex-col gap-1">
          <Select v-model="selectedPlatform" :options="dataPlatform" checkmark :highlightOnSelect="false" optionLabel="name" placeholder="Silakan pilih..." fluid class="rounded-lg [&.p-focus]:shadow-[2px_2px_0_#22d3ee,-2px_2px_0_#22d3ee,2px_-2px_0_#22d3ee,-2px_-2px_0_#22d3ee]">
            <template #value="slotProps">
              <div v-if="slotProps.value" class="flex items-center">
                <img v-if="slotProps.value.logo" :alt="slotProps.value.name" :src="slotProps.value.logo" @error="slotProps.value.logo = fallbackImage" class="w-5 mr-2" />
                <div v-else class="w-5 h-5 bg-gray-200 rounded-full mr-2"></div>
                <div>{{ slotProps.value.name }}</div>
              </div>
              <span v-else>
                {{ slotProps.placeholder }}
              </span>
            </template>
            <template #option="slotProps">
              <div class="flex items-center">
                <img v-if="slotProps.option.logo" :alt="slotProps.option.name" :src="slotProps.option.logo" @error="slotProps.option.logo = fallbackImage" class="w-5 mr-2" />
                <div v-else class="w-5 h-5 bg-gray-200 rounded-full mr-2"></div>
                <div>{{ slotProps.option.name }}</div>
              </div>
            </template>
          </Select>
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
        </FormField>

        <FormField v-if="initialValues.phone.show" v-slot="$field" name="phone" initialValue="" class="flex flex-col gap-1">
          <InputText
            v-model="initialValues.phone.value"
            @keypress="preventInvalidPhone"
            @input="validateInputPhone"
            type="tel"
            inputmode="numeric"
            placeholder="Nomor ponsel"
            fluid
            class="rounded-lg focus:shadow-[2px_2px_0_#22d3ee,-2px_2px_0_#22d3ee,2px_-2px_0_#22d3ee,-2px_-2px_0_#22d3ee]"
          />
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
        </FormField>

        <FormField v-if="initialValues.username.show" v-slot="$field" name="username" initialValue="" class="flex flex-col gap-1">
          <InputText
            v-model="initialValues.username.value"
            @keypress="preventInvalidUsername"
            @input="validateInputUsername"
            type="text"
            placeholder="Username"
            fluid
            class="rounded-lg focus:shadow-[2px_2px_0_#22d3ee,-2px_2px_0_#22d3ee,2px_-2px_0_#22d3ee,-2px_-2px_0_#22d3ee]"
          />
          <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">{{ $field.error?.message }}</Message>
        </FormField>

        <Button type="submit" severity="primary" label="Chat Sekarang" class="rounded-lg text-white bg-cyan-500 hover:bg-cyan-600" />
      </Form>

    </div>
  </div>
</template>

<style scoped>
/* Add any required scoped styles here */
</style>
