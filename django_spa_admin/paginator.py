from rest_framework.pagination import LimitOffsetPagination, PageNumberPagination
from rest_framework.response import Response
from rest_framework import status


class AdminPageNumberPagination(PageNumberPagination):
    # default_limit = 1
    # max_limit = 200
    page_size = 1
    page_query_param = 'page'
    page_size_query_param = 'page_size'

    def get_paginated_response(self, data):
        return Response(
            {
                'meta': {
                    'next': self.get_next_link(),
                    'previous': self.get_previous_link(),
                    'current_page': self.page.number,
                    'pages_count': self.page.paginator.num_pages,
                    'objects_count': self.page.paginator.count
                },
                'objects': data
            },
            status=status.HTTP_200_OK
        )

