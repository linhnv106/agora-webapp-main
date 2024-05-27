import { useRouter } from 'next/navigation';

export const useAppRouter = () => {
  const router = useRouter();

  return {
    onBack: () => {
      router.back();
    },

    //User + Admin | Streams
    getEditStreamView: (id: string) => {
      router.push(`/streams/${id}`);
    },

    getCreateStreamView: () => {
      router.push(`/streams/create`);
    },

    // Admin | User management
    getEditUserView: (id: string) => {
      router.push(`/admin/users/${id}`);
    },
  };
};
