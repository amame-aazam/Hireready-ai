import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resumeApi, AtsAnalysis, DomainItem } from '../api/resumeApi';

export const useResume = () => {
  const queryClient = useQueryClient();

  const latestQuery = useQuery<AtsAnalysis | null>({
    queryKey: ['resume', 'latest'],
    queryFn: () => resumeApi.getLatestAnalysis(),
    staleTime: 5 * 60 * 1000,
  });

  const domainsQuery = useQuery<DomainItem[]>({
    queryKey: ['domains', 'active'],
    queryFn: () => resumeApi.listDomains(),
    staleTime: 10 * 60 * 1000,
  });

  const uploadMutation = useMutation({
    mutationFn: ({
      file,
      domainId,
      applicationId,
    }: {
      file: File;
      domainId?: string;
      applicationId?: string;
    }) => resumeApi.uploadAndAnalyze(file, domainId, applicationId),
    onSuccess: (newAnalysis) => {
      queryClient.setQueryData(['resume', 'latest'], newAnalysis);
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });

  return {
    latestAnalysis: latestQuery.data || null,
    isLatestLoading: latestQuery.isLoading,
    domains: domainsQuery.data || [],
    isDomainsLoading: domainsQuery.isLoading,
    uploadResume: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    uploadError: uploadMutation.error,
    refetchLatest: latestQuery.refetch,
  };
};
