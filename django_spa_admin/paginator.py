from rest_framework.pagination import LimitOffsetPagination
from rest_framework.response import Response
from rest_framework import status


class AdminLimitOffsetPaginator(LimitOffsetPagination):
    default_limit = 100
    max_limit = 200

    def get_paginated_response(self, data):
        has_extra_page = self.count % self.limit > 0
        pages_count = self.count // self.limit + int(has_extra_page)
        return Response(
            {
                'meta': {
                    'next': self.get_next_link(),
                    'previous': self.get_previous_link(),
                    'pages_count': pages_count,
                    'objects_count': self.count
                },
                'objects': data
            },
            status=status.HTTP_200_OK
        )

